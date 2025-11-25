import React from 'react';
import { Check } from 'lucide-react';
import { formatTimestamp } from '@/utils/messageFormatters';

interface MessageTimestampProps {
  timestamp: Date;
  isUser: boolean;
  showTimestamp: boolean;
}

export const MessageTimestamp: React.FC<MessageTimestampProps> = ({
  timestamp,
  isUser,
  showTimestamp
}) => {
  if (!showTimestamp) return null;

  return (
    <div className={`flex items-center gap-1 text-xs text-muted-foreground mt-2 ${
      isUser ? 'justify-end' : 'justify-start'
    }`}>
      <span>{formatTimestamp(timestamp)}</span>
      {isUser && (
        <Check className="h-3 w-3 text-blue-500" />
      )}
    </div>
  );
};