from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch
import torch.nn.functional as F
import nltk
import spacy
from transformers import AutoTokenizer, AutoModel, utils, AutoModelForTokenClassification, pipeline, BertModel, BertTokenizer, BertForSequenceClassification, GPT2Model, GPT2Tokenizer, GPT2LMHeadModel
from bertviz.transformers_neuron_view import BertModel as BMV
from bertviz.transformers_neuron_view import BertTokenizer as BTV
from bertviz import head_view, model_view
from bertviz.neuron_view import show
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import KeyedVectors
import io
import base64

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# Load Word2Vec model
model_name = "GoogleNews-vectors-negative300.bin"
word2vec_model = KeyedVectors.load_word2vec_format(model_name, binary=True)

app = Flask(__name__)
CORS(app)

# Load BERT and GPT-2 models and tokenizers
bert_model = BertModel.from_pretrained('bert-base-uncased', output_attentions=True)
bert_tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
gpt2_fullmodel = GPT2Model.from_pretrained('gpt2', output_hidden_states=True)
gpt2_tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
gpt2_model = GPT2LMHeadModel.from_pretrained('gpt2', output_attentions=True)

@app.route('/')
def hello_world():
    return 'Hello, World from the Flask 🐍🧪 Backend!'

@app.route('/hm_attention', methods=['POST'])
def get_attention():
    data = request.get_json()
    text = data.get('text', '')

    inputs = bert_tokenizer.encode(text, return_tensors='pt')
    outputs = bert_model(inputs)
    attention = outputs[-1]  # Output includes attention weights when output_attentions=True
    tokens = bert_tokenizer.convert_ids_to_tokens(inputs[0])

    html_head_view = head_view(attention, tokens, html_action='return')
    html_model_view = model_view(attention, tokens, html_action='return', display_mode="dark")

    response = {
        'headView': html_head_view.data,
        'modelView': html_model_view.data,
        'tokens': tokens
    }

    return jsonify(response)

@app.route('/n_attention', methods=['POST'])
def get_neuron_attention():
    model = BMV.from_pretrained('bert-base-uncased', output_attentions=True)
    tokenizer = BTV.from_pretrained('bert-base-uncased', do_lower_case=True)
    data = request.get_json()
    sentence_a = data.get('sentence_a', '')
    sentence_b = data.get('sentence_b', '')
    layer = data.get('layer', 2)
    head = data.get('head', 0)

    html_neuron_view = show(model, 'bert', tokenizer, sentence_a, sentence_b, layer=layer, head=head, html_action='return', display_mode="dark")

    response = {
        'neuronView': html_neuron_view.data
    }

    return jsonify(response)

@app.route('/bert_attention', methods=['POST'])
def bert_attention_insights():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        inputs = bert_tokenizer.encode_plus(text, return_tensors='pt', add_special_tokens=True)
        with torch.no_grad():
            outputs = bert_model(**inputs)

        attentions = outputs.attentions
        all_attentions_average = []
        attentions_per_head = []

        for layer_attention in attentions:
            averaged_attention = layer_attention.mean(dim=1).squeeze().tolist()
            all_attentions_average.append(averaged_attention)

            layer_attentions_per_head = layer_attention.squeeze().permute(1, 0, 2).tolist()
            attentions_per_head.append(layer_attentions_per_head)

        token_ids = inputs['input_ids'].tolist()[0]
        tokens = bert_tokenizer.convert_ids_to_tokens(token_ids)

        return jsonify({
            "attention_matrices_average": all_attentions_average,
            "attention_matrices_per_head": attentions_per_head,
            "tokens": tokens
        })
    else:
        return jsonify({"error": "No text provided"}), 400
    
@app.route('/bert_visualization', methods=['POST'])
def bert_visualization():
    data = request.get_json()
    text = data.get('text', '')

    if text:
        # Load BERT model and tokenizer using bertviz
        model_version = 'bert-base-uncased'
        model = BMV.from_pretrained(model_version, output_attentions=True)
        tokenizer = BTV.from_pretrained(model_version)

        # Tokenize the input text
        tokens = tokenizer.tokenize(text)
        token_ids = tokenizer.convert_tokens_to_ids(tokens)
        input_ids = torch.tensor([token_ids])
        token_type_ids = torch.zeros_like(input_ids)

        # Get the attention weights and hidden states
        with torch.no_grad():
            outputs = model(input_ids, token_type_ids=token_type_ids)
            attention = outputs[-1]  # Access attention weights from the last element of the tuple
            hidden_states = outputs[2]  # Access hidden states from the third element of the tuple

        # Generate visualizations using bertviz
        head_view_html = show(attention, tokens, tokenizer, text, display_mode='html')
        model_view_html = show(hidden_states, tokens, tokenizer, text, display_mode='html')
        neuron_view_html = show(hidden_states, tokens, tokenizer, text, display_mode='html')

        # Return the rendered visualizations as JSON
        return jsonify({
            'head_view': head_view_html,
            'model_view': model_view_html,
            'neuron_view': neuron_view_html
        })
                        
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

import re

@app.route('/word_embedding_arithmetic', methods=['POST'])
def word_embedding_arithmetic():
    data = request.get_json()
    expression = data.get('expression', '')
    if not expression:
        return jsonify({"error": "No expression provided"}), 400
    try:
        # Use regular expressions to extract words and operators
        words = re.findall(r'\w+', expression)
        operators = re.findall(r'[\+\-]', expression)
        if len(words) < 2 or len(operators) != len(words) - 1:
            raise ValueError("Invalid expression format")
        result_vec = None
        for i in range(len(words)):
            word = words[i]
            vec = word2vec_model[word] if word in word2vec_model else None
            if vec is None:
                return jsonify({"error": f"Word '{word}' not found in the model"}), 400
            if i == 0:
                result_vec = vec.copy()  # Create a copy of the vector
            else:
                op = operators[i - 1]
                if op == '+':
                    result_vec += vec
                elif op == '-':
                    result_vec -= vec
        top_similarities = word2vec_model.most_similar(positive=[result_vec], topn=10)
        result_words = [{"word": word, "similarity": float(similarity)} for word, similarity in top_similarities]
        return jsonify({"result_words": result_words})
    except (ValueError, KeyError) as e:
        return jsonify({"error": str(e)}), 400
                                    
if __name__ == '__main__':
    app.run(debug=True)