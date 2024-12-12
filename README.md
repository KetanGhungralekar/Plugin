# Communication Assessment Platform

## Description
The Communication Assessment Platform integrates video functionality, speech analysis, and assessment features. It offers real-time video recording, storage, and playback. The system provides real-time speech transcription with over 70% accuracy and includes a scoring mechanism and personalized feedback. It also features body language analysis, multilingual support, and a tailored improvement plan.

## Core Features
- **Video Functionality**: Includes recording, storage, and playback of videos.
- **Speech Analysis**: Real-time transcription with >70% accuracy.
- **Assessment Features**: Provides scoring and detailed feedback mechanisms.
- **Cloud Storage**: Videos are stored in the cloud to handle any size of video.
- **Authentication**: Secure authentication using JWT.

## Project Structure
```
.vscode/
    settings.json
Plugin/
    .vscode/
        settings.json
    Backend/
        .idea/
        Final_Analyser.py
        Grammer_correcter.py
        New_Grammar_Corrector.py
        speechAnalysis.py
        Transcriber.py
    package.json
    plugin_frontend/
        .gitignore
        eslint.config.js
        generated_pdf/
        generated_pdfs/
        index.html
        package.json
        postcss.config.js
        src/
        tailwind.config.js
        temp_audio/
        tsconfig.app.json
        tsconfig.json
        tsconfig.node.json
    Plugin-Backend/
        ...
    README.md
    temp_audio/
temp_audio/
```

## Installation

### Frontend
1. Navigate to the `plugin_frontend` directory:
    ```bash
    cd Plugin/plugin_frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Build the project:
    ```bash
    npm run build
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```
5. Open the application at [http://localhost:5173](http://localhost:5173).

### Backend
1. Navigate to the `Backend` directory:
    ```bash
    cd Plugin/Backend
    ```
2. Install dependencies and run the server:
    ```bash
    # Assuming you have Python and pip installed
    pip install -r requirements.txt
    python Final_Analyser.py
    ```

## Usage
1. Open the frontend application in your browser.
2. Use the video recording feature to record a video.
3. The system will transcribe the speech in real-time and provide detailed analysis and feedback.

## Cloud Storage
**Videos are stored in the cloud using Cloudinary.** This allows the platform to handle videos of any size efficiently.

## Authentication
**Authentication is handled using JWT (JSON Web Tokens).** The backend generates a JWT upon successful login, which is then used to authenticate subsequent requests.

## Multiple Backends
**The platform uses multiple backends to handle different functionalities:**

### Python Backend
- **Grammar Analysis**: The Python backend is responsible for analyzing the grammar of the transcribed speech. It uses various NLP (Natural Language Processing) techniques to identify grammatical errors and provide suggestions for improvement.
- **Files**:
  - `Grammer_correcter.py`
  - `New_Grammar_Corrector.py`

### Whisper Backend
- **Speech Transcription**: The Whisper backend is used for the transcription of video. It processes the audio from the recorded video and converts it into text with high accuracy.
- **Files**:
  - `Transcriber.py`
  - `speechAnalysis.py`

## License
[MIT](https://choosealicense.com/licenses/mit/)
