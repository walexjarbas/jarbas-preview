
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X, Send } from 'lucide-react';
import { AudioRecordingState } from '@/types/chat';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}) => {
  const [recordingState, setRecordingState] = useState<AudioRecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    mediaRecorder: null,
    audioBlob: null,
  });

  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const chunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<NodeJS.Timeout>();
  const durationRef = useRef<number>(0); // Use ref to avoid stale closure

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Generate animated waveform bars
  const generateWaveform = () => {
    const bars = Array.from({ length: 20 }, () => Math.random() * 100 + 20);
    setWaveformBars(bars);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      // Use webm format which is better supported by Whisper
      const options = { mimeType: 'audio/webm;codecs=opus' };
      let mediaRecorder: MediaRecorder;
      
      if (MediaRecorder.isTypeSupported(options.mimeType)) {
        mediaRecorder = new MediaRecorder(stream, options);
      } else {
        // Fallback to default format
        mediaRecorder = new MediaRecorder(stream);
        console.log('Using fallback audio format');
      }
      
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const actualDuration = durationRef.current; // Use ref value to avoid stale closure
        console.log('Audio recorded:', { 
          size: audioBlob.size, 
          type: audioBlob.type,
          duration: actualDuration 
        });
        onRecordingComplete(audioBlob, actualDuration);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setRecordingState(prev => ({
          ...prev,
          isRecording: false,
          duration: 0,
          mediaRecorder: null,
          audioBlob: null,
        }));
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
        setWaveformBars([]);
      };

      mediaRecorder.start();
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        mediaRecorder,
        duration: 0,
      }));
      
      // Reset duration ref
      durationRef.current = 0;

      // Start duration counter
      intervalRef.current = setInterval(() => {
        durationRef.current += 1; // Update ref
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      // Start waveform animation
      generateWaveform();
      animationRef.current = setInterval(generateWaveform, 150);

      onRecordingStart?.();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (recordingState.mediaRecorder && recordingState.isRecording) {
      recordingState.mediaRecorder.stop();
      onRecordingStop?.();
    }
  };

  const cancelRecording = () => {
    if (recordingState.mediaRecorder && recordingState.isRecording) {
      recordingState.mediaRecorder.stop();
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        duration: 0,
        mediaRecorder: null,
        audioBlob: null,
      }));
      
      // Reset duration ref
      durationRef.current = 0;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      setWaveformBars([]);
      onRecordingStop?.();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (recordingState.isRecording) {
    return (
      <div className="flex items-center gap-2 flex-1 bg-muted rounded-lg px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={cancelRecording}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Waveform visualization */}
        <div className="flex items-center gap-0.5 flex-1 min-w-0">
          {waveformBars.map((height, index) => (
            <div
              key={index}
              className="bg-primary rounded-full transition-all duration-150 flex-shrink-0"
              style={{
                width: '2px',
                height: `${Math.max(height * 0.2, 4)}px`,
              }}
            />
          ))}
        </div>
        
        {/* Timer */}
        <span className="text-sm font-mono text-muted-foreground flex-shrink-0">
          {formatDuration(recordingState.duration)}
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0 text-primary"
          onClick={stopRecording}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={startRecording}
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
};
