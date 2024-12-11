import { useRef, useState, useCallback, useEffect } from 'react';
import { createMediaDownload } from '../utils/mediaUtils';
import { extractAudioFromBlob } from '../utils/mediaUtils';
import { convertToWAV } from '../utils/audioUtils';

interface UseVideoRecorderResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  previewRefUtils: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  changeIsRecording: (isRecording: boolean) => void;
  recordedChunksUtils: BlobPart[];
  error: string | null;
  isPreviewPlayingUtils: boolean;
  startRecordingUtils: () => Promise<void>;
  stopRecordingUtils: () => void;
  togglePreviewUtils: () => void;
  downloadVideoUtils: () => void;
  downloadAudioUtils: () => Promise<void>;
}

export function useVideoRecorder(): UseVideoRecorderResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRefUtils = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setisRecording] = useState(false);
  const [recordedChunksUtils, setRecordedChunksUtils] = useState<BlobPart[]>([]);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewPlayingUtils, setIsPreviewPlayingUtils] = useState(false);

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    setisRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startRecordingUtils = useCallback(async () => {
    try {
      cleanup();
      setError(null);
      setRecordedBlob(null);
      setRecordedChunksUtils([]);
  
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
  
      streamRef.current = stream;
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
  
      const mimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
      ];
  
      const selectedMimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
  
      if (!selectedMimeType) {
        throw new Error('No supported MIME type found for recording');
      }
  
      const options: MediaRecorderOptions = {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
      };
  
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
  
      const chunks: Blob[] = [];
      let recordedSize = 0;
  
      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
          recordedSize += e.data.size; // Keep track of the total size of the chunks
        }
      };
  
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMimeType });
        const finalSize = blob.size; // Get the size of the final combined Blob
  
        // Ensure that the size of the chunks matches the size of the final Blob before playing the preview
        if (recordedSize === finalSize) {
          setRecordedChunksUtils(chunks);
          setRecordedBlob(blob);
  
          if (previewRefUtils.current) {
            const url = URL.createObjectURL(blob);
            previewRefUtils.current.src = url;
            previewRefUtils.current.onloadedmetadata = () => {
              if (previewRefUtils.current) {
                previewRefUtils.current.play(); // Automatically start the preview once the metadata is loaded
                URL.revokeObjectURL(url);
              }
            };
          }
        } else {
          setError('Recorded chunks size does not match final blob size');
        }
  
        cleanup();
      };
  
      mediaRecorder.onerror = (event: Event) => {
        const errorMessage = 'Recording failed: ' + (event instanceof ErrorEvent ? event.message : 'Unknown error');
        setError(errorMessage);
        cleanup();
      };
  
      // Start recording with a slice time (e.g., 100ms, so data is collected more regularly)
      mediaRecorder.start(100); // Record in chunks every 100ms
  
      setisRecording(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Error accessing media devices: ' + errorMessage);
      cleanup();
    }
  }, [cleanup]);
  
  

  const stopRecordingUtils = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop(); // This should trigger `onstop` and process the chunks.
      setisRecording(false); // Make sure to update the recording state.
    }
  }, [isRecording]);  

  const togglePreviewUtils = useCallback(() => {
    if (previewRefUtils.current) {
      if (previewRefUtils.current.paused) {
        previewRefUtils.current.play();
        setIsPreviewPlayingUtils(true);
      } else {
        previewRefUtils.current.pause();
        setIsPreviewPlayingUtils(false);
      }
    }
  }, []);

  const downloadVideoUtils = useCallback(() => {
    if (recordedChunksUtils.length === 0) return;
    const mimeType = mediaRecorderRef.current?.mimeType || 'video/webm';
    createMediaDownload(recordedChunksUtils, mimeType, 'recorded-video.webm');
  }, [recordedChunksUtils]);

  const downloadAudioUtils = useCallback(async () => {
    if (!recordedBlob) return;

    try {
      const audioBuffer = await extractAudioFromBlob(recordedBlob);
      const audioBlob = await convertToWAV(audioBuffer);
      createMediaDownload([audioBlob], 'audio/wav', 'recorded-audio.wav');
    } catch (error) {
      setError('Error extracting audio: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [recordedBlob]);

  const changeIsRecording = (isRecording: boolean) => {
    setisRecording(isRecording);
  };

  return {
    videoRef,
    previewRefUtils,
    isRecording,
    changeIsRecording,
    recordedChunksUtils,
    error,
    isPreviewPlayingUtils,
    startRecordingUtils,
    stopRecordingUtils,
    togglePreviewUtils,
    downloadVideoUtils,
    downloadAudioUtils,
  };
}
