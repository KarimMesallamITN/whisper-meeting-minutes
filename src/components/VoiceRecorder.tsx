import { useState, useRef } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          sendAudioChunk(e.data);
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      // Request summary when recording stops
      requestSummary();
    }
  };

  const sendAudioChunk = async (audioChunk: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioChunk);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTranscription(prev => prev + ' ' + data.text);
      }
    } catch (err) {
      console.error('Error sending audio chunk:', err);
    }
  };

  const requestSummary = async () => {
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcription }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranscription(data.summary);
      }
    } catch (err) {
      console.error('Error getting summary:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-6 rounded-full transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? (
            <StopIcon className="h-12 w-12 text-white" />
          ) : (
            <MicrophoneIcon className="h-12 w-12 text-white" />
          )}
        </button>
        
        <div className="w-full p-4 bg-white rounded-lg shadow min-h-[200px] text-right">
          {transcription || 'التسجيل سيظهر هنا...'}
        </div>
      </div>
    </div>
  );
}