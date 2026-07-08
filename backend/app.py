import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.route("/")
def home():
    return {"message": "Crochelle backend is running!"}


@app.route("/generate", methods=["POST"])
def generate_pattern():

    data = request.get_json()

    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({
            "error": "Please describe what you want to crochet."
        }), 400

    try:

        full_prompt = f"""
You are Willow, Crochelle's expert crochet pattern designer.

Create a clear, practical crochet pattern based on the user's idea.

Include:
- Pattern title
- Skill level
- Materials
- Abbreviations
- Step-by-step instructions
- Assembly instructions when needed
- Finishing notes

Make the pattern easy to read and suitable for a crocheter to follow.

User's crochet idea:
{prompt}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )

        return jsonify({
            "pattern": response.text
        })

    except Exception as error:

        print(error)

        return jsonify({
            "error": "Willow couldn't draft the pattern."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)