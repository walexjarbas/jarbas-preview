import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconSend2 } from '@tabler/icons-react';
import { Paperclip, Mic, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text') => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  onSendFile: (file: File) => void;
  disabled?: boolean;
}
export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendAudio,
  onSendFile,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<NodeJS.Timeout>();
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef<boolean>(false);
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
      inputRef.current?.focus();
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const generateWaveform = () => {
    const bars = Array.from({
      length: 40
    }, () => Math.random() * 100 + 20);
    setWaveformBars(bars);
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      cancelledRef.current = false;
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, {
          type: 'audio/wav'
        });

        // Only send audio if recording wasn't cancelled
        if (!cancelledRef.current) {
          onSendAudio(audioBlob, recordingDuration);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setRecordingDuration(0);
        setMediaRecorder(null);
        setWaveformBars([]);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start waveform animation
      generateWaveform();
      animationRef.current = setInterval(generateWaveform, 150);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      cancelledRef.current = false;
      mediaRecorder.stop();
    }
  };
  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      cancelledRef.current = true;
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      setMediaRecorder(null);
      setWaveformBars([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }
  };
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 20MB.",
        variant: "destructive"
      });
      return;
    }
    onSendFile(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return <footer className="flex items-center gap-2 border-t border-border p-4">
      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled={disabled} onClick={handleFileAttachment}>
        <Paperclip className="h-4 w-4" />
      </Button>
      
      <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 h-10">
        {isRecording ? <div className="flex items-center gap-2 flex-1 h-full py-2">
            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={cancelRecording}>
              <X className="h-3 w-3" />
            </Button>
            
            {/* Waveform visualization */}
            <div className="flex items-center gap-0.5 flex-1 min-w-0 h-6">
              {waveformBars.map((height, index) => <div key={index} style={{
            height: `${Math.max(height * 0.15, 3)}px`,
            width: '2px'
          }} className="rounded-full transition-all duration-150 bg-slate-400" />)}
            </div>
            
            {/* Timer */}
            <span className="text-xs font-manrope text-muted-foreground flex-shrink-0 min-w-[2rem]">
              {formatDuration(recordingDuration)}
            </span>
          </div> : <Input ref={inputRef} type="text" placeholder="Escreva sua mensagem..." value={message} onChange={e => setMessage(e.target.value)} onKeyPress={handleKeyPress} disabled={disabled} className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full" />}
        
        {message.trim() || isRecording ? <Button type={isRecording ? "button" : "submit"} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" disabled={disabled} onClick={isRecording ? stopRecording : undefined}>
            <IconSend2 className="h-4 w-4" />
          </Button> : <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={startRecording} disabled={disabled}>
            <Mic className="h-4 w-4" />
          </Button>}
      </form>
      
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar" />
    </footer>;
};
