
export interface Message {
  id: string;
  type: 'text' | 'audio' | 'system' | 'file';
  content: string; // text content, audio URL, or file URL
  sender: 'user' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'transcribing' | 'generating-speech';
  duration?: number; // for audio messages in seconds
  fileName?: string; // for file messages
  fileSize?: number; // for file messages in bytes
  fileType?: string; // MIME type for file messages
  transcribedText?: string; // for audio messages that have been transcribed
  audioUrl?: string; // for text messages that have audio responses
}

export interface AudioRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  mediaRecorder: MediaRecorder | null;
  audioBlob: Blob | null;
}
