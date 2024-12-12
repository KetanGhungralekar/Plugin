import os
import time
from flask import Flask, request, jsonify, send_from_directory
import whisper  # Import whisper library
import pronouncing
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import re
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

CORS(app)

# Path to store generated PDFs
PDF_STORAGE_PATH = '../plugin_frontend/generated_pdfs'

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

# Function to perform pronunciation analysis (e.g., using the Pronouncing library)
def analyze_pronunciation(text):
    pronunciation_issues = []
    words = text.split()
    for word in words:
        if pronouncing.phones_for_word(word):
            pronunciation_issues.append(f"Good pronunciation: {word}")
        else:
            pronunciation_issues.append(f"Pronunciation issue: {word}")
    return pronunciation_issues

# Function to analyze speaking pace (words per minute)
def analyze_speaking_pace(text):
    words = text.split()
    num_words = len(words)
    # Assuming the average speaking time for 1 word is ~0.3 seconds
    speaking_pace = num_words / 0.3  # words per minute
    return speaking_pace

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

    # Save the PDF to storage
    os.makedirs(PDF_STORAGE_PATH, exist_ok=True)
    c.save()

    # Move the generated report to the storage folder
    os.rename(filename, os.path.join(PDF_STORAGE_PATH, filename))

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

def download_pdf(filename):
    try:
        # Define the file path
        pdf_path = os.path.join(PDF_STORAGE_PATH, filename)
        
        # Check if the file exists
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'File not found'}), 404
        

        # Return the file with proper headers
        return send_from_directory(
            PDF_STORAGE_PATH, 
            filename
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
