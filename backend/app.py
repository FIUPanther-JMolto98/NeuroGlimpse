from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertModel
import numpy as np

app = Flask(__name__)
CORS(app)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased', output_attentions=True)

@app.route('/')
def hello_world():
    return 'Hello, World from the Flask 🧪 Backend!'

@app.route('/attention', methods=['POST'])
def attention_insights():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        inputs = tokenizer(text, return_tensors='pt', add_special_tokens=True)
        tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"].squeeze().tolist())
        outputs = model(**inputs)
        attentions = outputs.attentions

        # Convert attentions to numpy array
        attentions_np = np.stack([att.detach().cpu().numpy() for att in attentions])

        # Compute the average over layers and heads to get a 2D aggregated attention
        print("BEFORE MEAN OPERATION:", attentions_np.shape)
        aggregated_attention_2d = np.mean(attentions_np, axis=(0, 1))
        print("AFTER MEAN OPERATION:", aggregated_attention_2d.shape)
        # Averaging across layers to get a (seq_len, seq_len) matrix
        final_aggregated_attention_2d = np.mean(aggregated_attention_2d, axis=0)
        print("FINAL AGGREGATED 2D SHAPE:", final_aggregated_attention_2d.shape)

        # Further reduce the 2D attention to 1D by averaging over one of the dimensions
        aggregated_attention_1d_out = np.mean(final_aggregated_attention_2d, axis=1)
        print("AGGREGATED 1D SHAPE (OUTGOING):", aggregated_attention_1d_out.shape)
        aggregated_attention_1d_in = np.mean(final_aggregated_attention_2d, axis=0)
        print("AGGREGATED 1D SHAPE (INCOMING):", aggregated_attention_1d_in.shape)
        aggregated_attention_1d = (aggregated_attention_1d_out + aggregated_attention_1d_in) / 2

        # Convert numpy arrays to lists for JSON serialization
        aggregated_attention_2d_list = aggregated_attention_2d.tolist()
        aggregated_attention_1d_list = aggregated_attention_1d.tolist()

        return jsonify({
            "tokens": tokens, 
            "aggregated_attention_2d": final_aggregated_attention_2d.tolist(),
            "aggregated_attention_1d": aggregated_attention_1d.tolist()  # or aggregated_attention_1d_in.tolist()
        })
    else:
        return jsonify({"error": "No text provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)