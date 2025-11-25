
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './MessageItem';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  onPlayAudio?: (audioUrl: string) => void;
  playingAudioId?: string;
  currentTime?: number;
  duration?: number;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onPlayAudio,
  playingAudioId,
  currentTime = 0,
  duration = 0
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const shouldShowAvatar = (message: Message, index: number) => {
    // Always show avatar for user messages
    if (message.sender === 'user') {
      return true;
    }
    
    // For bot messages, only show avatar if:
    // 1. It's the last message in the array, OR
    // 2. The next message is from a different sender (user)
    const isLastMessage = index === messages.length - 1;
    const nextMessage = messages[index + 1];
    const nextMessageFromDifferentSender = nextMessage && nextMessage.sender !== message.sender;
    
    return isLastMessage || nextMessageFromDifferentSender;
  };

  const shouldShowTimestamp = (message: Message, index: number) => {
    // Always show timestamp for user messages
    if (message.sender === 'user') {
      return true;
    }
    
    // For bot messages, only show timestamp if:
    // 1. It's the last message in the array, OR
    // 2. The next message is from a different sender (user)
    const isLastMessage = index === messages.length - 1;
    const nextMessage = messages[index + 1];
    const nextMessageFromDifferentSender = nextMessage && nextMessage.sender !== message.sender;
    
    return isLastMessage || nextMessageFromDifferentSender;
  };

  const isFirstInGroup = (message: Message, index: number) => {
    // Check if this is the first message in a group (different sender from previous message)
    if (index === 0) return true;
    const previousMessage = messages[index - 1];
    return previousMessage.sender !== message.sender;
  };

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      <div className="py-4">
        {messages.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            onPlayAudio={onPlayAudio}
            isPlaying={playingAudioId === message.id}
            currentTime={currentTime}
            duration={duration}
            showAvatar={shouldShowAvatar(message, index)}
            showTimestamp={shouldShowTimestamp(message, index)}
            isFirstInGroup={isFirstInGroup(message, index)}
            currentAudioId={playingAudioId}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
