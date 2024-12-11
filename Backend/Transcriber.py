from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import whisper
import os
from shutil import copyfileobj
import logging

# Initialize the FastAPI app
app = FastAPI()

# Allow all origins for CORS (you can restrict it later if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, replace with a specific URL like ["http://localhost:3000"] for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Whisper model (can choose "tiny", "small", "medium", or "large" based on your requirements)
model = whisper.load_model("medium")

# Define the upload folder to save audio files
UPLOAD_FOLDER = "uploaded_audio_files"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists

# Set up logging
logging.basicConfig(level=logging.INFO)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
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

        # Transcribe the audio using the Whisper model
        result = model.transcribe(file_path)
        logging.info(f"Transcription result: {result}")

        return {"transcription": result["text"]}
    
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
    # Run the FastAPI app on 0.0.0.0 to allow external connections
    uvicorn.run(app, host="0.0.0.0", port=5000)
