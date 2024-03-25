from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertModel, GPT2Tokenizer, GPT2LMHeadModel, GPT2Config

app = Flask(__name__)
CORS(app)

# Load BERT and GPT-2 models and tokenizers
bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertModel.from_pretrained('bert-base-uncased', output_attentions=True)
gpt2_tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
gpt2_model = GPT2LMHeadModel.from_pretrained('gpt2',output_attentions=True)

@app.route('/')
def hello_world():
    return 'Hello, World from the Flask 🐍🧪 Backend!'

@app.route('/bert_attention', methods=['POST'])
def bert_attention_insights():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        inputs = bert_tokenizer(text, return_tensors='pt', add_special_tokens=True)
        outputs = bert_model(**inputs)
        attentions = outputs.attentions[-1]  # Get the last layer attentions (for simplicity)

        # Process attention data here for visualization
        # This example simply returns the attention matrix of the last attention head
        attention_matrix = attentions[0, -1].detach().numpy().tolist()

        return jsonify({"attention_matrix": attention_matrix})
    else:
        return jsonify({"error": "No text provided"}), 400

@app.route('/gpt2_next_word_prob', methods=['POST'])
def next_word_prob():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        # Encode the input text
        inputs = gpt2_tokenizer.encode(text, return_tensors='pt')

        # Get model output (logits)
        with torch.no_grad():
            outputs = gpt2_model(inputs)
            logits = outputs.logits

        # Select logits of the last token and apply softmax to get probabilities
        last_token_logits = logits[:, -1, :]
        probabilities = F.softmax(last_token_logits, dim=-1)

        # Optionally, get the top tokens and their probabilities
        top_probs, top_indices = probabilities.topk(10)  # Adjust the number of top tokens as needed
        top_tokens = [gpt2_tokenizer.decode([idx]) for idx in top_indices[0]]

        top_probs = top_probs.tolist()[0]
        top_tokens_probs = dict(zip(top_tokens, top_probs))

        return jsonify({"top_tokens_probs": top_tokens_probs})
    else:
        return jsonify({"error": "No text provided"}), 400

@app.route('/gpt2_attention', methods=['POST'])
def gpt2_attention_insights():
    data = request.get_json()
    text = data.get('text', '')
    average_heads = data.get('averageHeads', True)

    if text:
        inputs = gpt2_tokenizer.encode_plus(text, return_tensors='pt', add_special_tokens=True)
        token_ids = inputs['input_ids'].tolist()[0] # Convert tensor to list
        tokens = gpt2_tokenizer.convert_ids_to_tokens(token_ids)

        with torch.no_grad():
            outputs = gpt2_model(**inputs, output_attentions=True)

        attentions = outputs.attentions
        all_attentions = []
        for layer_attention in attentions:
            if average_heads:
                averaged_attention = layer_attention.mean(dim=1).squeeze().tolist()
                all_attentions.append(averaged_attention)
            else:
                all_attentions.append(layer_attention.squeeze().tolist())

        return jsonify({"attention_matrices": all_attentions, "tokens": tokens})
    else:
        return jsonify({"error": "No text provided"}), 400
            
if __name__ == '__main__':
    app.run(debug=True)