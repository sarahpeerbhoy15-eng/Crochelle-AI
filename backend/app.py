import os
from PIL import Image
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

    prompt = request.form.get("prompt", "").strip()

    image = request.files.get("image")

    if not prompt and not image:
        return jsonify({
        "error": "Please provide a crochet idea or reference image."
    }), 400

    try:
        if not prompt:
            prompt = "Create a crochet pattern based on the provided reference image."
       
        full_prompt = f"""
You are Willow, Crochelle's expert crochet pattern designer.

Create a complete, practical crochet pattern based on the user's idea.

Return the pattern in Markdown using EXACTLY this structure:

# [Creative Pattern Name]

**Skill Level:** [Beginner, Easy, Intermediate, or Advanced]

## Materials

- List all required yarn, hook sizes, stuffing, safety eyes, needles, and other materials.

## Abbreviations

- List every crochet abbreviation used in the pattern and its meaning.

## Pattern Instructions

Use clear section headings for each individual crochet piece.

Write every round or row separately.

Include stitch counts at the end of each round or row whenever applicable.

## Assembly

Provide clear step-by-step assembly instructions.

## Finishing Notes

Provide any final shaping, embroidery, weaving-in, or finishing instructions.

Important rules:

- Do not include an introduction or greeting.
- Do not speak directly to the user.
- Do not include commentary before or after the pattern.
- Do not mention that you are an AI.
- Use consistent US crochet terminology.
- Make the instructions detailed enough to actually follow.
- Preserve clear Markdown formatting.
- Return only the crochet pattern.

User's crochet idea:

{prompt}
"""

        if image:

            reference_image = Image.open(image.stream)

            contents = [
                full_prompt,
                reference_image
            ]

        else:

            contents = full_prompt

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents
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