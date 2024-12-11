from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import whisper
import os
from shutil import copyfileobj
import logging
import google.generativeai as genai
from flask import Flask, request, jsonify

# Initialize the FastAPI app
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Whisper model
model = whisper.load_model("medium")

# Define the upload folder to save audio files
UPLOAD_FOLDER = "uploaded_audio_files"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists

# Set up logging
logging.basicConfig(level=logging.INFO)

# Google Generative AI API configuration
os.environ["API_KEY"] = "AIzaSyABDqSEMXQAtYoMTUWLyfUL_kF6hlyN0-o"
genai.configure(api_key=os.environ["API_KEY"])

@app.post("/transcribe")
async def transcribe_and_check_grammar(file: UploadFile = File(...)):
    try:
        global model
        logging.info(f"Received file: {file.filename}")

        # Save the uploaded file
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as f:
            copyfileobj(file.file, f)

        logging.info(f"Audio saved to: {file_path}")

        # Verify the file format using pydub (optional but useful for some audio formats)
        from pydub import AudioSegment
        try:
            audio = AudioSegment.from_file(file_path)
            logging.info(f"Audio properties: {audio.frame_rate}Hz, {audio.sample_width * 8}-bit, {audio.channels} channel(s)")
        except Exception as audio_error:
            raise ValueError(f"Invalid audio format: {audio_error}")

        # Transcribe the audio using Whisper
        result = model.transcribe(file_path)
        transcription = result["text"]
        logging.info(f"Transcription result: {transcription}")

        # Prepare the grammar checking prompt
        prompt = f"Check the grammar of the following sentence and improve it. Add ^ ^ to show new sentence structure. Strike through unnecessary words. Provide the output as a properly structured JSON format. The sentence to check is: \"{transcription}\". Only give the corrected sentence with the necessary strikethroughs and ^ ^ (if necessary to make it grammatically correct) in with nothing else."

        # Use Google Generative AI for grammar correction
        model12 = genai.GenerativeModel("gemini-1.5-flash")
        response = model12.generate_content(prompt)

        # Return the grammar-corrected response
        return JSONResponse(content={"transcription": transcription, "grammar_checked": response.text})

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"message": f"An error occurred: {str(e)}"}
        )
    
    finally:
        # Cleanup - remove the uploaded file after processing
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Removed file: {file_path}")

if __name__ == "__main__":
    # Run the FastAPI app
    uvicorn.run(app, host="0.0.0.0", port=5000)
