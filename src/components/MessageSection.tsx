
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EditableMessageList } from './EditableMessageList';
import { Message } from '@/types/chat';
import { JarbasStateManager } from '@/hooks/useJarbasState';

interface MessageSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  jarbasState: JarbasStateManager;
}

export const MessageSection: React.FC<MessageSectionProps> = ({
  isExpanded,
  onToggle,
  jarbasState,
}) => {
  console.log('MessageSection render - isExpanded:', isExpanded);
  
  // Use unified state instead of local state
  const useAI = jarbasState.state.useAI;
  const messages = jarbasState.state.messages;

  console.log('MessageSection - messages state:', messages);

  // No need to load from localStorage - unified state handles this

  const handleToggle = () => {
    console.log('MessageSection - handleToggle called');
    onToggle();
  };

  const handleAddMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: 'Nova mensagem',
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    };
    jarbasState.updateMessages([...messages, newMessage]);
  };

  const handleUpdateMessage = (id: string, content: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, content } : msg
    );
    jarbasState.updateMessages(updatedMessages);
  };

  const handleDeleteMessage = (id: string) => {
    const filteredMessages = messages.filter(msg => msg.id !== id);
    jarbasState.updateMessages(filteredMessages);
  };

  const handleReorderMessages = (newMessages: Message[]) => {
    jarbasState.updateMessages(newMessages);
  };

  console.log('MessageSection - about to render, isExpanded:', isExpanded);

  return (
    <div className={`rounded-lg border bg-background p-4 transition-all sm:p-6 ${isExpanded ? (useAI ? 'border-black' : 'border-black min-h-[400px]') : 'border-border min-h-[80px]'}`}>
      <button className="flex w-full items-center justify-between text-left" onClick={handleToggle}>
        <div className="flex items-center gap-3">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/407b78f90d7ddc130046e74d96b7e332ff10883b?placeholderIfAbsent=true" 
            className="h-5 w-5" 
            alt="Message Icon" 
          />
          <span className="text-sm text-foreground sm:text-base font-semibold">
            Mensagem Inicial
          </span>
        </div>
        <img 
          src={isExpanded ? "https://cdn.builder.io/api/v1/image/assets/TEMP/71d0aa96b2bd63880973acce1c400956e89bbc9f?placeholderIfAbsent=true" : "https://cdn.builder.io/api/v1/image/assets/TEMP/a2ca2f944f6a7d9ca902201432ea1a0b06a08351?placeholderIfAbsent=true"} 
          className="h-4 w-4" 
          alt="Toggle Icon" 
        />
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
          <div className="h-px bg-border" />
          
          <div className="flex items-center gap-3">
            <Switch
              checked={useAI}
              onCheckedChange={jarbasState.updateUseAI}
              id="use-ai-toggle"
            />
            <label htmlFor="use-ai-toggle" className="text-sm font-semibold text-foreground cursor-pointer">
              Usar IA para personalizar mensagem
            </label>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Use a mensagem padrão para cumprimentar seus clientes ou deixe Jarbas personalizar a interação.
          </p>
          
          {!useAI && (
            <>
              <EditableMessageList 
                messages={messages.sort((a, b) => parseInt(a.id) - parseInt(b.id))}
                onUpdateMessage={handleUpdateMessage}
                onDeleteMessage={handleDeleteMessage}
                onReorderMessages={handleReorderMessages}
              />
              
              <Button
                variant="outline"
                onClick={handleAddMessage}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar mensagem
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
