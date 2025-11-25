import { useCallback } from 'react';
import { Message } from '@/types/chat';
import { OpenAIService } from '@/services/openaiService';
import { buildSystemPrompt } from '@/utils/promptBuilder';
import { calculateAudioDuration } from '@/utils/audioUtils';
import { JarbasState } from '@/hooks/useJarbasState';

export const useAudioMessages = (
  openaiService: OpenAIService | null,
  jarbasState: JarbasState | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const handleSendAudio = useCallback(async (audioBlob: Blob, duration: number) => {
    if (!openaiService || !jarbasState) {
      console.warn('OpenAI service or Jarbas state not configured');
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newMessage: Message = {
      id: messageId,
      type: 'audio',
      content: audioUrl,
      sender: 'user',
      timestamp: new Date(),
      status: 'transcribing',
      duration,
    };

    console.log('User audio message created with duration:', duration, 'ID:', messageId);
    
    // Add user audio message first
    setMessages(prev => [...prev, newMessage]);

    try {
      // Step 1: Transcribe audio
      console.log('Starting transcription for message:', messageId);
      const transcribedText = await openaiService.transcribeAudio(audioBlob);
      
      // Step 2: Update message with transcribed text
      setMessages(prev => {
        const updated = prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, transcribedText, status: 'sent' as const }
            : msg
        );
        console.log('Updated message with transcription:', messageId);
        return updated;
      });

      // Step 3: Get updated messages for AI response
      setMessages(prev => {
        const messagesWithTranscription = prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, transcribedText, status: 'sent' as const }
            : msg
        );
        
        console.log('Generating AI response with complete history:', messagesWithTranscription.length, 'messages');
        
        // Generate AI response asynchronously but don't nest setMessages
        (async () => {
          try {
            const promptConfig = buildSystemPrompt(jarbasState);
            const textResponse = await openaiService.generateResponse(messagesWithTranscription, promptConfig);
            const audioResponse = await openaiService.textToSpeech(textResponse);
            const botAudioUrl = URL.createObjectURL(audioResponse);
            
            // Calculate duration for bot audio response
            let botAudioDuration: number | undefined;
            try {
              botAudioDuration = await calculateAudioDuration(audioResponse);
            } catch (error) {
              console.warn('Could not calculate bot audio duration:', error);
            }
            
            const botResponseId = `${Date.now()}-bot-${Math.random().toString(36).substr(2, 9)}`;
            
            // Create bot response with audio and duration
            const botResponse: Message = {
              id: botResponseId,
              type: 'audio',
              content: botAudioUrl,
              sender: 'bot',
              timestamp: new Date(),
              status: 'sent',
              duration: botAudioDuration,
              transcribedText: textResponse, // Add the original text so it's included in conversation history
            };

            console.log('Adding bot audio response:', botResponseId);
            setMessages(prev => [...prev, botResponse]);
          } catch (error) {
            console.error('Error generating AI response:', error);
            
            const errorResponse: Message = {
              id: `${Date.now()}-error-${Math.random().toString(36).substr(2, 9)}`,
              type: 'text',
              content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
              sender: 'bot',
              timestamp: new Date(),
              status: 'sent',
            };
            
            setMessages(prev => [...prev, errorResponse]);
          }
        })();
        
        return messagesWithTranscription;
      });

    } catch (error) {
      console.error('Error transcribing audio:', error);
      
      // Update message with error status
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'sent' as const, transcribedText: 'Erro ao transcrever áudio' }
          : msg
      ));
      
      const errorResponse: Message = {
        id: `${Date.now()}-transcription-error-${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: 'Desculpe, não consegui transcrever sua mensagem de voz. Tente enviar novamente.',
        sender: 'bot',
        timestamp: new Date(),
        status: 'sent',
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
  }, [openaiService, jarbasState, setMessages]);

  return { handleSendAudio };
};