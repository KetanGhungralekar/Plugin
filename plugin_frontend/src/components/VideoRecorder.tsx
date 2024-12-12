import React, { useRef, useState } from 'react';
import { Video, Mic, Circle, StopCircle, AlertCircle } from 'lucide-react';
import { Language, indianLanguages } from '../types/languages';
import { LanguageSelector } from './LanguageSelector';
import { TranscriptionDisplay } from './TranscriptionDisplay';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { Button } from './ui/Button';

export function VideoRecorder() {
  // const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [totalTranscript, setTotalTranscript] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(indianLanguages[0]);
  // const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<null | (typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition)>(null);

  const {
    videoRef,
    previewRefUtils,
    recordedChunksUtils,
    downloadAudioUtils,
    downloadVideoUtils,
    stopRecordingUtils,
    startRecordingUtils,
    isRecording,
    changeIsRecording,
    downloadSpeechAnalysisUtils,
  } = useVideoRecorder();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob);
        }
      };

      // Start speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage.code;

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        setTotalTranscript((prevTranscript) => prevTranscript + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setTranscript('Error: Microphone access denied. Please allow microphone access and try again.');
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      recorder.start();
      setMediaRecorder(recorder);
      changeIsRecording(true);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setTranscript('Error: Could not access camera or microphone. Please ensure permissions are granted.');
    }
  };
  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
    formData.append('file', audioFile);
  
    try {
      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload audio');
      }
  
      const data = await response.json();
      console.log('Transcription result:', data.transcription);
      setTranscript(data.transcription);
    } catch (error) {
      console.error('Error sending audio to backend:', error);
      setTranscript('Error: Unable to process the audio.');
    }
  };
  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
  
      mediaRecorder.ondataavailable = async (event) => {
        const audioBlob = event.data;
  
        if (audioBlob.size > 0) {
          const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
          await sendAudioToBackend(audioFile);
        }
      };
  
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  
    changeIsRecording(false);

    const grammarCheckedTranscript = await checkGrammar(totalTranscript);
    setTranscript(grammarCheckedTranscript);
  };
  
  const checkGrammar = async (text : string) => {
    try {
      const response = await fetch('http://localhost:5000/grammar-check?sentence=' + encodeURIComponent(text));
      if (!response.ok) {
        throw new Error('Grammar check API failed');
      }
      const data = await response.json();
      console.log(data.question);
      return data.question;
    } catch (error) {
      console.error('Error checking grammar:', error);
      return text;  
    }
  };
  
  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    if (isRecording) {
      stopRecording();
      setTranscript('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Multilingual Video Recorder</h2>
            <LanguageSelector
              languages={indianLanguages}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          
          <div>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
              <video
                ref={videoRef}
                className="w-full h-full"
                autoPlay
                playsInline
                muted={isRecording}
              />
            </div>
            

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={isRecording 
                  ? () => { stopRecordingUtils(); stopRecording(); } 
                  : () => { startRecordingUtils(); startRecording(); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >

                {isRecording ? (
                  <StopCircle className="w-5 h-5" />
                ) : (              
                  <Circle className="w-5 h-5" />      
                  )}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>

          <TranscriptionDisplay
            isRecording={isRecording}
            transcript={transcript}
            selectedLanguage={selectedLanguage}
          />

          <div>
            <div className="relative">
              <h2 className="text-lg font-semibold mb-2">Preview Recording</h2>
              <video
                ref={previewRefUtils}
                className="w-full aspect-video bg-gray-900 rounded-lg shadow-lg"
                playsInline
                onLoadedMetadata={() => {
                  if (previewRefUtils.current) {
                    previewRefUtils.current.controls = true; 
                    previewRefUtils.current.play(); 
                  }
                }}
              />
            </div>
            
            {recordedChunksUtils.length > 0 && (
              <div className="flex justify-center gap-4 mt-5 mb-6">
                <Button onClick={downloadVideoUtils} variant="secondary">
                  <Video className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button onClick={downloadAudioUtils} variant="secondary">
                  <Mic className="w-4 h-4 mr-2" />
                  Download Audio
                </Button>
                <Button onClick={downloadSpeechAnalysisUtils} variant="secondary">
                  Download Speech Analysis 
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div>
        <p className="text-gray-600">{totalTranscript}</p>
      </div> */}
    </div>
  );
}


