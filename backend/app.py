from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Initialize your model and tokenizer here
# For example, using a sentiment-analysis pipeline (you'll replace this with whatever you need)
nlp = pipeline("sentiment-analysis")

@app.route('/')
def hello_world():
    return 'Hello, World from the Flask backend!'

@app.route('/analyze', methods=['POST'])
def analyze_text():
    if request.method == 'POST':
        # Extract text from the request body
        data = request.get_json()
        text = data.get('text')

        if text:
            # Here, replace with your actual model processing
            # For example, sentiment analysis (this is just a placeholder)
            analysis_result = nlp(text)

            # Format the result as JSON and return
            return jsonify(analysis_result)
        else:
            return jsonify({"error": "No text provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)