from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch
import torch.nn.functional as F
import nltk
import spacy
from transformers import AutoModelForTokenClassification, pipeline, BertModel, BertTokenizer, BertForSequenceClassification, GPT2Model, GPT2Tokenizer, GPT2LMHeadModel
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import KeyedVectors

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# Load Word2Vec model
model_name = "GoogleNews-vectors-negative300.bin"
word2vec_model = KeyedVectors.load_word2vec_format(model_name, binary=True)

app = Flask(__name__)
CORS(app)

# Load BERT and GPT-2 models and tokenizers
bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
bert_model = BertForSequenceClassification.from_pretrained('bert-base-uncased')
gpt2_fullmodel = GPT2Model.from_pretrained('gpt2', output_hidden_states=True)
gpt2_tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
gpt2_model = GPT2LMHeadModel.from_pretrained('gpt2', output_attentions=True)

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
        attentions = outputs.attentions[-1]

        attention_matrix = attentions[0, -1].detach().numpy().tolist()
        return jsonify({"attention_matrix": attention_matrix})
    else:
        return jsonify({"error": "No text provided"}), 400

@app.route('/gpt2_next_word_prob', methods=['POST'])
def next_word_prob():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        inputs = gpt2_tokenizer.encode(text, return_tensors='pt')
        with torch.no_grad():
            outputs = gpt2_model(inputs)
            logits = outputs.logits

        last_token_logits = logits[:, -1, :]
        probabilities = F.softmax(last_token_logits, dim=-1)
        top_probs, top_indices = probabilities.topk(10)
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

    if text:
        inputs = gpt2_tokenizer.encode_plus(text, return_tensors='pt', add_special_tokens=True)
        with torch.no_grad():
            outputs = gpt2_model(**inputs, output_attentions=True)

        attentions = outputs.attentions
        all_attentions_average = []
        attentions_per_head = []

        for layer_attention in attentions:
            averaged_attention = layer_attention.mean(dim=1).squeeze().tolist()
            all_attentions_average.append(averaged_attention)

            layer_attentions_per_head = layer_attention.squeeze().permute(1, 0, 2).tolist()
            attentions_per_head.append(layer_attentions_per_head)

        token_ids = inputs['input_ids'].tolist()[0]
        tokens = gpt2_tokenizer.convert_ids_to_tokens(token_ids)

        return jsonify({
            "attention_matrices_average": all_attentions_average,
            "attention_matrices_per_head": attentions_per_head,
            "tokens": tokens
        })
    else:
        return jsonify({"error": "No text provided"}), 400

# # Load tokenizer and model
# tokenizer = AutoTokenizer.from_pretrained("dbmdz/bert-large-cased-finetuned-conll03-english")
# model = AutoModelForTokenClassification.from_pretrained("dbmdz/bert-large-cased-finetuned-conll03-english")

# Load spaCy model for POS tagging
nlp = spacy.load("en_core_web_sm")

# Initialize the NER pipeline with Hugging Face transformers
ner_pipeline = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")

@app.route('/word_embedding_distance', methods=['POST'])
def word_embedding_distance():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    tokens = text.split()
    
    token_embeddings = []
    for token in tokens:
        if token in word2vec_model.key_to_index:
            embedding = word2vec_model[token]
            token_embeddings.append(embedding)
        else:
            token_embeddings.append(np.zeros(word2vec_model.vector_size))

    # Apply PCA to reduce the dimensionality of the embeddings to 2D
    pca = PCA(n_components=2)
    reduced_embeddings = pca.fit_transform(token_embeddings)

    # Calculate cosine similarity between each pair of embeddings
    similarity_matrix = cosine_similarity(token_embeddings)

    # Prepare the data for the response
    embedding_data = []
    for i in range(len(tokens)):
        word = tokens[i]
        x, y = reduced_embeddings[i]
        embedding_data.append({
            "word": word,
            "x": float(x),
            "y": float(y)
        })
        for j in range(i+1, len(tokens)):
            similarity = similarity_matrix[i][j]
            embedding_data.append({
                "word1": word,
                "word2": tokens[j],
                "similarity": float(similarity)
            })

    return jsonify({"embedding_data": embedding_data})

@app.route('/analyze_text', methods=['POST'])
def analyze_text():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Perform NER
    ner_results = ner_pipeline(text)
    ner_entities = [{"entity": result['entity'], "word": result['word'], "score": float(result['score'])} for result in ner_results]

    # Perform POS tagging with spaCy
    doc = nlp(text)
    pos_tags = [{"word": token.text, "pos": token.pos_} for token in doc]

    return jsonify({"entities": ner_entities, "pos_tags": pos_tags})

@app.route('/pca_activations', methods=['POST'])
def pca_activations():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Tokenize input text using GPT-2 tokenizer
    inputs = gpt2_tokenizer(text, return_tensors='pt')

    # Disable gradient calculation for efficiency
    with torch.no_grad():
        # Get model outputs from GPT-2 (ensure using gpt2_fullmodel with output_hidden_states=True)
        outputs = gpt2_fullmodel(**inputs)
    
    # Extract hidden states
    # outputs.hidden_states is a tuple of length (num_layers + 1), with each element having shape (batch_size, sequence_length, hidden_size)
    hidden_states = outputs.hidden_states

    # Ensure we have hidden states; otherwise, return an error
    if hidden_states is None:
        return jsonify({"error": "Model did not return hidden states"}), 500

    # Concatenate hidden states across all layers to form a single tensor
    # Shape after concatenation: (num_layers, sequence_length * hidden_size)
    # Note: We're concatenating along the feature dimension for PCA, which is a slight deviation from the previous mean approach
    activations = torch.cat([layer.squeeze(0) for layer in hidden_states[1:]], dim=-1).numpy()  # Excluding the initial embeddings layer

    # Apply PCA to reduce dimensions to 3
    pca = PCA(n_components=3)
    reduced_activations = pca.fit_transform(activations)  # Shape: (num_layers, 3)

    # Prepare data for JSON response
    pca_data = [{"layer": idx+1, "pc1": float(pc[0]), "pc2": float(pc[1]), "pc3": float(pc[2])} for idx, pc in enumerate(reduced_activations)]

    return jsonify(pca_data)

if __name__ == '__main__':
    app.run(debug=True)