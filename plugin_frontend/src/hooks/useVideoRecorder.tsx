import { useRef, useState, useCallback, useEffect } from 'react';
import { createMediaDownload } from '../utils/mediaUtils';
import { extractAudioFromBlob } from '../utils/mediaUtils';
import { convertToWAV } from '../utils/audioUtils';
import { useAuth } from '../context';

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
  const [analysisResults, setAnalysisResults] = useState<boolean>(false);

  const { uploadVideo } = useAuth();

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };


  const convertDecodedToBase64 = (decodedData: string, mimeType: string): string => {
    // Encode the decoded binary string back to Base64
    const base64Encoded = btoa(decodedData);

    const base64String = `data:${mimeType};base64,${base64Encoded}`;

    return base64String;
  };

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
      setAnalysisResults(true);
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

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: selectedMimeType });
        const finalSize = blob.size;

        if (recordedSize === finalSize) {
          setRecordedChunksUtils(chunks);
          setRecordedBlob(blob);

          // Convert the Blob into a File object
          const videoFile = new File([blob], "recorded_video.webm", { type: "video/webm" });

          await uploadVideo({
            title: "Video Recording",
            description: "This is a video recording",
            role: "ROLE_USER",
            uploadedBy: "user123",
            videoFile: videoFile,
          });

          if (previewRefUtils.current) {
            const url = URL.createObjectURL(blob);
            previewRefUtils.current.src = url;
            previewRefUtils.current.onloadedmetadata = () => {
              if (previewRefUtils.current) {
                previewRefUtils.current.play();
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

      mediaRecorder.start(100);

      setisRecording(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError('Error accessing media devices: ' + errorMessage);
      cleanup();
    }
  }, [cleanup]);

  // useEffect(() => {
  //   const analyzeAudio = async () => {
  //     if (recordedBlob) {
  //       try {
  //         const audioBuffer = await extractAudioFromBlob(recordedBlob);
  //         const audioBlob = await convertToWAV(audioBuffer);

  //         const formData = new FormData();
  //         formData.append('file', new Blob([audioBlob], { type: 'audio/wav' }), 'recorded-audio.wav');

  //         console.log("YOU ARE HERE");
  //         const response = await fetch('http://localhost:5000/analyze', {
  //           method: 'POST',
  //           body: formData,
  //         });

  //         if (!response.ok) {
  //           throw new Error('Audio analysis failed');
  //         }

  //         const data = await response.json();

  //         console.log('Analysis Results:', data);

  //         const pdfReportLink = `../../${data.pdf_report}`;
  //         window.open(pdfReportLink, '_blank');

  //       } catch (error) {
  //         setError('Error processing audio: ' + (error instanceof Error ? error.message : String(error)));
  //       }
  //     }
  //   };

  //   analyzeAudio();  // Call the async function inside useEffect

  //   return () => {
  //     cleanup();
  //   };
  // }, [recordedBlob, cleanup]);

  const stopRecordingUtils = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setisRecording(false);
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

  const convertChunksToBase64Utils = useCallback(async (): Promise<string | null> => {
    if (!recordedBlob) return null;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        resolve(base64String || null);
      };

      reader.onerror = (error) => {
        setError('Error converting to Base64: ' + error.message);
        reject(error);
      };

      reader.readAsDataURL(recordedBlob);
    });
  }, [recordedBlob]);
  const downloadSpeechAnalysisUtils = useCallback(async () => {
    if (!recordedBlob) return;

    try {
      const audioBuffer = await extractAudioFromBlob(recordedBlob);
      const audioBlob = await convertToWAV(audioBuffer);

      const formData = new FormData();
      formData.append('file', new Blob([audioBlob], { type: 'audio/wav' }), 'recorded-audio.wav');

      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Audio analysis failed');
      }

      const data = await response.json();

      console.log('Analysis Results:', data);

    } catch (error) {
      setError('Error processing audio: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [recordedBlob]);



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
    downloadSpeechAnalysisUtils,
  };
}
