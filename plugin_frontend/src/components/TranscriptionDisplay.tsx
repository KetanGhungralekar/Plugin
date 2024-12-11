import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Language } from '../types/languages';

interface TranscriptionDisplayProps {
  isRecording: boolean;
  transcript: string;
  selectedLanguage: Language;
}

export function TranscriptionDisplay({
  isRecording,
  transcript,
  selectedLanguage,
}: TranscriptionDisplayProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isRecording ? (
            <Mic className="w-5 h-5 text-green-500 animate-pulse" />
          ) : (
            <MicOff className="w-5 h-5 text-gray-400" />
          )}
          <h3 className="font-semibold text-gray-700">
            Live Transcription ({selectedLanguage.name})
          </h3>
        </div>
      </div>
      <div 
        className="min-h-[100px] max-h-[200px] overflow-y-auto bg-white rounded p-4 text-gray-700"
        style={{ 
          direction: selectedLanguage.code === 'ur-IN' ? 'rtl' : 'ltr',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {transcript || `Speak in ${selectedLanguage.name} to see transcription...`}
      </div>
    </div>
  );
}