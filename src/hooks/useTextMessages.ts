import { useCallback } from 'react';
import { Message } from '@/types/chat';
import { OpenAIService } from '@/services/openaiService';
import { buildSystemPrompt } from '@/utils/promptBuilder';
import { JarbasState } from '@/hooks/useJarbasState';

export const useTextMessages = (
  openaiService: OpenAIService | null,
  jarbasState: JarbasState | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleSendMessage = useCallback(async (content: string, type: 'text') => {
    if (!openaiService || !jarbasState) {
      console.warn('OpenAI service or Jarbas state not configured');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    // Add user message and process AI response
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      console.log('Complete message history before API call:', updatedMessages.length, 'messages');
      
      // Process AI response asynchronously
      (async () => {
        setIsLoading(true);
        try {
          const promptConfig = buildSystemPrompt(jarbasState);
          const responseContent = await openaiService.generateResponse(updatedMessages, promptConfig);
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'text',
            content: responseContent,
            sender: 'bot',
            timestamp: new Date(),
            status: 'sent',
          };
          
          setMessages(prev => [...prev, botResponse]);
        } catch (error) {
          console.error('Error generating AI response:', error);
          
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'text',
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
            sender: 'bot',
            timestamp: new Date(),
            status: 'sent',
          };
          
          setMessages(prev => [...prev, errorResponse]);
        } finally {
          setIsLoading(false);
        }
      })();
      
      return updatedMessages;
    });
  }, [openaiService, jarbasState, setMessages, setIsLoading]);

  return { handleSendMessage };
};