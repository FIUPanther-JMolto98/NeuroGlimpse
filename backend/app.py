from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertModel

app = Flask(__name__)
CORS(app)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased', output_attentions=True)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# METHOD TO RECURSIVELY CONVERT TENSORS TO PYTHON LISTS
def tensor_to_list(tensor):
    return tensor.detach().cpu().tolist()

@app.route('/attention', methods=['POST'])
def attention_insights():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        inputs = tokenizer(text, return_tensors='pt', add_special_tokens=True)
        outputs = model(**inputs)
        # EXTRACT ATTENTION WEIGHTS FROM OUTPUTS
        attentions = outputs.attentions

        # CONVERT TENSORS TO LISTS VIA DEFINED METHOD
        attentions_list = [tensor_to_list(attention) for attention in attentions]

        return jsonify({"attentions": attentions_list})
    else:
        return jsonify({"error": "No text provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)