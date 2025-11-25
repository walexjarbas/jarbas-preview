import { useCallback } from 'react';
import { Message } from '@/types/chat';
import { OpenAIService } from '@/services/openaiService';
import { JarbasState } from '@/hooks/useJarbasState';
import { convertFileToBase64, isImage, getSupportedFileTypes } from '@/utils/fileProcessing';
import { buildSystemPrompt } from '@/utils/promptBuilder';

export const useFileMessages = (
  openaiService: OpenAIService | null,
  jarbasState: JarbasState | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const handleSendFile = useCallback(async (file: File) => {
    // Validate file type
    if (!getSupportedFileTypes().includes(file.type)) {
      console.warn('Unsupported file type:', file.type);
      return;
    }

    try {
      // Convert file to base64
      const base64Data = await convertFileToBase64(file);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'file',
        content: base64Data,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };

      setMessages(prev => [...prev, newMessage]);

      // Generate AI response if service is available
      if (openaiService && jarbasState) {
        try {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ));

          const promptConfig = buildSystemPrompt(jarbasState);
          
          // Get all messages including the new file message
          const allMessages = await new Promise<Message[]>((resolve) => {
            setMessages(prev => {
              resolve([...prev]);
              return prev;
            });
          });

          const response = await openaiService.generateResponse(allMessages, promptConfig);

          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'text',
            content: response,
            sender: 'bot',
            timestamp: new Date(),
            status: 'sent',
          };

          setMessages(prev => [...prev, botResponse]);
        } catch (error) {
          console.error('Error generating response for file:', error);
          
          // Fallback response
          const errorResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'text',
            content: `Recebi seu arquivo "${file.name}"! Como posso ajudar você com ele?`,
            sender: 'bot',
            timestamp: new Date(),
            status: 'sent',
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }, [openaiService, jarbasState, setMessages]);

  return { handleSendFile };
};