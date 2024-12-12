import google.generativeai as genai
import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# Initialize FastAPI application
app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development purposes)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Set the API key for Google Generative AI
os.environ["API_KEY"] = "AIzaSyABDqSEMXQAtYoMTUWLyfUL_kF6hlyN0-o"
genai.configure(api_key=os.environ["API_KEY"])

# Define the route for grammar checking
@app.get('/grammar-check')
async def generate_question(sentence: str, questionType: Optional[str] = None):  # Make questionType optional
    prompt = f"Check the grammar of the following sentence and improve it. Add ^ ^ to show new sentence structure. Strike through unnecessary words. The sentence to check is: \"{sentence}\". Only give the corrected sentence with the necessary strikethroughs and ^ ^ (if necessary to make it grammatically correct) and make the component sentences logically connected, as different sentences in the same input language."

    # Generate the response using the Generative AI model
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # Return the corrected grammar as a JSON response
    return JSONResponse(content={"question": response.text})

# If running directly (not with uvicorn), start the application with FastAPI
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
