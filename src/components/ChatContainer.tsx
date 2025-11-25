import React, { useCallback } from 'react';
import { ChatInitialState } from './ChatInitialState';
import { ChatConversation } from './ChatConversation';
import { Message } from '@/types/chat';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface ChatContainerProps {
  messages: Message[];
  initialMessages: Message[];
  hasConversation: boolean;
  isLoading: boolean;
  isGeneratingWelcome: boolean;
  onStartConversation: () => void;
  onSendMessage: (content: string, type: 'text') => void;
  onSendAudio: (audioBlob: Blob, duration: number) => void;
  onSendFile: (file: File) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  initialMessages,
  hasConversation,
  isLoading,
  isGeneratingWelcome,
  onStartConversation,
  onSendMessage,
  onSendAudio,
  onSendFile
}) => {
  const { isPlaying, currentAudioId, currentTime, duration, playAudio } = useAudioPlayer();

  const handlePlayAudio = useCallback((audioUrl: string) => {
    const allMessages = [...initialMessages, ...messages];
    const message = allMessages.find(msg => msg.content === audioUrl);
    if (message) {
      playAudio(audioUrl, message.id);
    }
  }, [initialMessages, messages, playAudio]);

  if (!hasConversation) {
    return <ChatInitialState onStartConversation={onStartConversation} isLoading={isGeneratingWelcome} />;
  }

  return (
    <ChatConversation
      messages={messages}
      onSendMessage={onSendMessage}
      onSendAudio={onSendAudio}
      onSendFile={onSendFile}
      onPlayAudio={handlePlayAudio}
      currentAudioId={currentAudioId}
      currentTime={currentTime}
      duration={duration}
      isLoading={isLoading}
    />
  );
};