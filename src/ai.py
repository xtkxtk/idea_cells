from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from config import Config

genai.configure(api_key="AIzaSyDD8RGgCLS6F8yArsncoVFVtJCKFLeHkQg")

app = Flask(__name__)
CORS(app)  # CORS 설정 추가

# 분할 API 엔드포인트
@app.route('/split', methods=['POST'])
def split_text_endpoint():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        response = genai.generate_text(
            model='gemini-pro',
            prompt=f"이 아이디어를 세부적인 6개의 새로운 창의적인 아이디어로 분할: {text}",
            max_tokens=500
        )
        splits = response.generations[0].text.split('\n')
        print(splits)
        return jsonify({'splits': splits}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 병합 API 엔드포인트
@app.route('/merge', methods=['POST'])
def merge_texts_endpoint():
    data = request.json
    texts = data.get('texts')
    if not texts or len(texts) < 2:
        return jsonify({'error': 'Provide at least two texts to merge'}), 400

    try:
        joined_text = " ".join(texts)
        response = genai.generate_text(
            model='gemini-pro',
            prompt=f"이 아이디어들을 합쳐서 새로운 창의적인 아이디어를 만들어줘: {joined_text}",
            max_tokens=500
        )
        merged = response.generations[0].text

        return jsonify({'merged': merged}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
