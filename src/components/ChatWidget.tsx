import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatContainer } from './ChatContainer';
import { ChatConfiguration } from './ChatConfiguration';
import { AudioPlayerProvider } from '@/contexts/AudioPlayerContext';
import { Message } from '@/types/chat';
import { OpenAIService } from '@/services/openaiService';
import { useChatConfiguration } from '@/hooks/useChatConfiguration';
import { useChatMessages } from '@/hooks/useChatMessages';
import { buildSystemPrompt } from '@/utils/promptBuilder';

export const ChatWidget: React.FC = () => {
  const [openaiService] = useState<OpenAIService>(new OpenAIService());
  const [isGeneratingWelcome, setIsGeneratingWelcome] = useState(false);
  
  const {
    activeConfig,
    jarbasState,
    initialMessages,
  } = useChatConfiguration();

  const {
    messages,
    setMessages,
    isLoading,
    handleSendMessage,
    handleSendAudio,
    handleSendFile
  } = useChatMessages(openaiService, jarbasState);

  const handleReload = () => {
    console.log('Restarting chat');
    setMessages([]);
    
    // Log current configuration for debugging
    if (activeConfig) {
      console.log('Active configuration:', activeConfig);
    }
  };

  const handleStartConversation = async () => {
    // Log configuration details
    if (jarbasState) {
      console.log('Starting conversation with configuration:', {
        objective_id: jarbasState.selectedObjective,
        ai_enabled: jarbasState.useAI,
        guidelines_count: jarbasState.guidelines.length,
        personalization_fields: jarbasState.personalizationFields.length
      });
    }

    // When AI is enabled, generate a personalized welcome message
    if (jarbasState?.useAI && openaiService) {
      setIsGeneratingWelcome(true);
      try {
        // Build the prompt with personalization context
        const promptConfig = buildSystemPrompt(jarbasState);
        
        // Create a specific prompt for welcome message generation
        const welcomePrompt = `${promptConfig.systemPrompt}

TAREFA ESPECÍFICA: Gere uma mensagem de boas-vindas personalizada e acolhedora para iniciar a conversa. 
Use as informações de personalização disponíveis para criar uma saudação única e relevante.
Mantenha a mensagem concisa (máximo 2 frases) e natural.
Não pergunte "Como posso ajudar?" - seja mais específico baseado no objetivo e contexto.`;

        // Generate personalized welcome message
        const personalizedWelcome = await openaiService.generateResponse(
          [], // Empty message history for welcome
          { 
            systemPrompt: welcomePrompt,
            userContext: promptConfig.userContext 
          },
          { temperature: 0.9, maxTokens: 150 }
        );

        const aiWelcomeMessage: Message[] = [
          {
            id: '1',
            type: 'text',
            content: personalizedWelcome.trim(),
            sender: 'bot',
            timestamp: new Date(),
            status: 'read',
          },
        ];
        
        setMessages(aiWelcomeMessage);
        return;
      } catch (error) {
        console.error('Error generating AI welcome message:', error);
        // Fallback to simple welcome message if AI generation fails
        const fallbackMessage: Message[] = [
          {
            id: '1',
            type: 'text',
            content: 'Olá! Como posso te ajudar hoje?',
            sender: 'bot',
            timestamp: new Date(),
            status: 'read',
          },
        ];
        setMessages(fallbackMessage);
        return;
      } finally {
        setIsGeneratingWelcome(false);
      }
    }

    // When AI is disabled, use initial messages or fallback
    if (initialMessages.length > 0) {
      setMessages([...initialMessages]);
    } else {
      // Fallback to default messages if none configured
      const welcomeMessages: Message[] = [
        {
          id: '1',
          type: 'text',
          content: 'Olá! Aqui é o Jarbas falando. Estou aqui para tirar suas dúvidas, mas você sempre pode falar com nossa equipe.',
          sender: 'bot',
          timestamp: new Date(),
          status: 'read',
        },
        {
          id: '2',
          type: 'text',
          content: 'Como posso te ajudar hoje?',
          sender: 'bot',
          timestamp: new Date(),
          status: 'read',
        },
      ];
      setMessages(welcomeMessages);
    }
  };

  // Check if conversation has started
  const hasConversation = messages.length > 0;

  return (
    <AudioPlayerProvider>
      <aside className="flex h-[600px] w-full flex-col rounded-2xl bg-background shadow-lg lg:w-[360px]">
        <ChatHeader hasConversation={hasConversation} onReload={handleReload} />
        
        <ChatContainer
          messages={messages}
          initialMessages={initialMessages}
          hasConversation={hasConversation}
          isLoading={isLoading}
          isGeneratingWelcome={isGeneratingWelcome}
          onStartConversation={handleStartConversation}
          onSendMessage={handleSendMessage}
          onSendAudio={handleSendAudio}
          onSendFile={handleSendFile}
        />
        
        <ChatConfiguration jarbasState={jarbasState} />
      </aside>
    </AudioPlayerProvider>
  );
};
