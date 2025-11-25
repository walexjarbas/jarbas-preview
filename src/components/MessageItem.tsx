import React from 'react';
import { Message } from '@/types/chat';
import { MessageAvatar } from './message/MessageAvatar';
import { MessageTimestamp } from './message/MessageTimestamp';
import { TextMessageContent } from './message/TextMessageContent';
import { AudioBubble } from './message/AudioBubble';
import { FileMessage } from './message/FileMessage';

interface MessageItemProps {
  message: Message;
  onPlayAudio?: (audioUrl: string) => void;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  isFirstInGroup?: boolean;
  currentAudioId?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  onPlayAudio,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  showAvatar = true,
  showTimestamp = true,
  isFirstInGroup = false,
  currentAudioId
}) => {
  const isUser = message.sender === 'user';

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <div className={`rounded-2xl p-3 text-sm ${
              isUser 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted text-foreground'
            }`}>
              <TextMessageContent 
                content={message.content} 
                status={message.status} 
              />
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-2">
            <AudioBubble
              audioId={message.id}
              content={message.content}
              duration={message.duration}
              isUser={isUser}
              transcribedText={message.transcribedText}
            />
          </div>
        );

      case 'file':
        return (
          <div className={`${isUser ? 'ml-auto' : ''}`}>
            <FileMessage
              content={message.content}
              fileName={message.fileName}
              fileType={message.fileType}
              isUser={isUser}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} ${
      showAvatar 
        ? isFirstInGroup 
          ? 'mb-4 mt-6' 
          : 'mb-4' 
        : isUser 
          ? 'mb-1' 
          : 'mb-3'
    }`}>
      <MessageAvatar isUser={isUser} showAvatar={showAvatar} />
      
      <div className={`max-w-[280px] ${isUser ? 'order-first' : ''}`}>
        {renderMessageContent()}
        
        <MessageTimestamp 
          timestamp={message.timestamp}
          isUser={isUser}
          showTimestamp={showTimestamp}
        />
      </div>
    </div>
  );
};