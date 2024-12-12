import os
import time
from flask import Flask, request, jsonify
import whisper  # Import whisper library
import pronouncing
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import re
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

CORS(app)

# Initialize Whisper model
model = whisper.load_model("base")  # You can choose different sizes like 'small', 'medium', 'large'

# Function to transcribe speech to text using Whisper
def transcribe_audio(file_path):
    result = model.transcribe(file_path)
    return result['text']

# Simple grammar analysis (alternative to LanguageTool)
def analyze_grammar(text):
    errors = []
    if text[0].islower():
        errors.append({"message": "Sentence should start with a capital letter.", "rule": "CAPITALIZATION_RULE"})
    if not text.endswith(('.', '!', '?')):
        errors.append({"message": "Sentence should end with a period, exclamation, or question mark.", "rule": "PUNCTUATION_RULE"})

    repeated_words = re.findall(r'\b(\w+)\s+\1\b', text, flags=re.IGNORECASE)
    for word in repeated_words:
        errors.append({"message": f"Repeated word: '{word}'", "rule": "REPEATED_WORD_RULE"})

    return errors

# Function to analyze speaking pace (words per minute)
def analyze_speaking_pace(text):
    word_count = len(text.split())
    time_taken = len(text.split()) / 2  # average speaking pace: 2 words per second
    pace = word_count / time_taken * 60  # words per minute
    return pace

# Function to analyze pronunciation using phonetic matching (simple analysis)
def analyze_pronunciation(text):
    words = text.split()
    pronunciation_issues = []
    for word in words:
        phonemes = pronouncing.phones_for_word(word)
        if not phonemes:
            pronunciation_issues.append(f'No phonetic match for "{word}"')
    return pronunciation_issues

# Function to generate a PDF report
def generate_pdf_report(text, grammar_analysis, pronunciation_analysis, speaking_pace, filename="report.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, height - 40, "Speech Analysis Report")

    # Text Section
    c.setFont("Helvetica", 12)
    y_position = height - 60
    c.drawString(100, y_position, f"Original Text: {text}")
    y_position -= 20

    # Grammar Analysis Section
    c.drawString(100, y_position, f"Grammar Issues: {len(grammar_analysis)} issues found")
    y_position -= 20
    for issue in grammar_analysis:
        c.drawString(100, y_position, f" - {issue['message']}: Rule - {issue['rule']}")
        y_position -= 20

    # Pronunciation Analysis Section
    c.drawString(100, y_position, f"Pronunciation Issues: {len(pronunciation_analysis)} issues found")
    y_position -= 20
    for issue in pronunciation_analysis:
        c.drawString(100, y_position, f" - {issue}")
        y_position -= 20

    # Speaking Pace Section
    c.drawString(100, y_position, f"Speaking Pace: {speaking_pace:.2f} words per minute")
    y_position -= 20

    # Save the PDF
    c.save()

@app.route('/analyze', methods=['POST'])
def analyze_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the file temporarily
    file_path = os.path.join("temp_audio", file.filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    file.save(file_path)

    # Transcribe audio to text using Whisper
    text = transcribe_audio(file_path)
    if not text:
        return jsonify({'error': 'Could not transcribe audio'}), 500

    # Analyze grammar, pronunciation, and speaking pace
    grammar_analysis = analyze_grammar(text)
    pronunciation_analysis = analyze_pronunciation(text)
    speaking_pace = analyze_speaking_pace(text)

    # Generate PDF report
    pdf_filename = f"report_{int(time.time())}.pdf"
    generate_pdf_report(text, grammar_analysis, pronunciation_analysis, speaking_pace, pdf_filename)

    # Return the analysis and a link to the generated PDF
    return jsonify({
        'text': text,
        'grammar_analysis': grammar_analysis,
        'pronunciation_analysis': pronunciation_analysis,
        'speaking_pace': speaking_pace,
        'pdf_report': pdf_filename
    })

if __name__ == '__main__':
    app.run(debug=True)
