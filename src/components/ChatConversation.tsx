
import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/types/chat';

interface ChatConversationProps {
  messages: Message[];
  onSendMessage: (content: string, type: 'text') => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  onSendFile: (file: File) => void;
  onPlayAudio: (audioUrl: string) => void;
  currentAudioId?: string;
  currentTime: number;
  duration: number;
  isLoading?: boolean;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  messages,
  onSendMessage,
  onSendAudio,
  onSendFile,
  onPlayAudio,
  currentAudioId,
  currentTime,
  duration,
  isLoading = false
}) => {
  return (
    <>
      <MessageList 
        messages={messages}
        onPlayAudio={onPlayAudio}
        playingAudioId={currentAudioId}
        currentTime={currentTime}
        duration={duration}
      />
      
      <MessageInput
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
        onSendFile={onSendFile}
        disabled={isLoading}
      />
    </>
  );
};
