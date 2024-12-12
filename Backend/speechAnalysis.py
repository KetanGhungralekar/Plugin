import speech_recognition as sr
import numpy as np
import librosa
from textblob import TextBlob
from difflib import SequenceMatcher
from fastapi import FastAPI, File, Form, UploadFile
from pydantic import BaseModel
from io import BytesIO
import uvicorn

app = FastAPI()

# Pydantic model for the reference text
class AssessmentRequest(BaseModel):
    reference_text: str

def load_audio(audio_path):
    """Load the audio file using librosa."""
    audio, sr = librosa.load(audio_path, sr=None)  
    return audio, sr

def transcribe_audio(audio_path):
    """Transcribe audio to text using SpeechRecognition."""
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
        try:
            return recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            return "Audio not clear enough for transcription."

def grammar_analysis(text):
    """Analyze grammar using TextBlob."""
    blob = TextBlob(text)
    corrections = []
    for sentence in blob.sentences:
        corrected = str(sentence.correct())
        if str(sentence) != corrected:
            corrections.append((str(sentence), corrected))
    return corrections

def pronunciation_analysis(text, reference):
    """Evaluate pronunciation using SequenceMatcher for text similarity."""
    matcher = SequenceMatcher(None, text, reference)
    return matcher.ratio() * 100  # Percentage similarity

def speaking_pace(audio_duration, word_count):
    """Calculate speaking pace in WPM."""
    words_per_minute = word_count / (audio_duration / 60)
    return words_per_minute

def clarity_analysis(audio, sr):
    """Assess voice clarity using spectral properties (SNR)."""
    rms = np.sqrt(np.mean(audio**2))
    noise_floor = np.percentile(audio, 10)  # Estimate noise floor
    snr = 20 * np.log10(rms / noise_floor) if noise_floor != 0 else 0
    return snr

def generate_report(results, save_path="report1.txt"):
    """Generate a detailed text report."""
    with open(save_path, "w") as report:
        report.write("VERBAL COMMUNICATION ASSESSMENT REPORT\n")
        report.write("=====================================\n\n")
        report.write(f"Overall Score: {results['Overall Score']} / 100\n\n")
        report.write("1. Grammar Analysis:\n")
        for error in results['Grammar Errors']:
            report.write(f"  Original: {error[0]}\n")
            report.write(f"  Corrected: {error[1]}\n")
        report.write(f"\nGrammar Score: {results['Grammar Score']}%\n\n")
        report.write(f"2. Pronunciation Score: {results['Pronunciation Score']}%\n\n")
        report.write(f"3. Speaking Pace: {results['Speaking Pace']} WPM\n")
        report.write(f"Pace Score: {results['Pace Score']}%\n\n")
        report.write(f"4. Voice Clarity (SNR): {results['Clarity Score']} dB\n")
        report.write("=====================================\n")

# Main pipeline
@app.post("/assess/")
async def verbal_communication_assessment(audio_file: UploadFile = File(...), reference_text: str = Form(...)):
    """Main function to assess verbal communication."""
    
    audio_bytes = await audio_file.read()
    audio_path = "/tmp/temp_audio.wav"  # Temporarily save the audio file to disk
    with open(audio_path, "wb") as f:
        f.write(audio_bytes)
    
    audio, sr = load_audio(audio_path)
    transcription = transcribe_audio(audio_path)
    word_count = len(transcription.split())
    audio_duration = librosa.get_duration(y=audio, sr=sr)

    # Scoring Metrics
    grammar_errors = grammar_analysis(transcription)
    grammar_score = 100 - len(grammar_errors) * 5  # Deduct 5 points per error

    pronunciation_score = pronunciation_analysis(transcription, reference_text)

    speaking_rate = speaking_pace(audio_duration, word_count)
    pace_score = max(0, min(100, 100 - abs(speaking_rate - 130)))  # Optimal pace: 130 WPM

    clarity_score = clarity_analysis(audio, sr)

    # Overall Score (Weighted)
    overall_score = 0.3 * grammar_score + 0.3 * pronunciation_score + 0.2 * pace_score + 0.2 * clarity_score

    # Results
    results = {
        "Transcription": transcription,
        "Grammar Errors": grammar_errors,
        "Grammar Score": grammar_score,
        "Pronunciation Score": pronunciation_score,
        "Speaking Pace": speaking_rate,
        "Pace Score": pace_score,
        "Clarity Score": clarity_score,
        "Overall Score": overall_score
    }

    # Generate Report
    generate_report(results)

    return results

# If the script is executed directly, run the FastAPI app using uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
