import { useState } from 'react';
import { Message } from '@/types/chat';
import { OpenAIService } from '@/services/openaiService';
import { JarbasState } from '@/hooks/useJarbasState';
import { useTextMessages } from './useTextMessages';
import { useAudioMessages } from './useAudioMessages';
import { useFileMessages } from './useFileMessages';

export const useChatMessages = (
  openaiService: OpenAIService | null,
  jarbasState: JarbasState | null
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use specialized hooks for different message types
  const { handleSendMessage } = useTextMessages(openaiService, jarbasState, setMessages, setIsLoading);
  const { handleSendAudio } = useAudioMessages(openaiService, jarbasState, setMessages);
  const { handleSendFile } = useFileMessages(openaiService, jarbasState, setMessages);

  return {
    messages,
    setMessages,
    isLoading,
    handleSendMessage,
    handleSendAudio,
    handleSendFile
  };
};