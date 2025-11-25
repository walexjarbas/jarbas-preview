import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageAvatarProps {
  isUser: boolean;
  showAvatar: boolean;
}

export const MessageAvatar: React.FC<MessageAvatarProps> = ({
  isUser,
  showAvatar
}) => {
  if (isUser) return null;

  return (
    <div className="flex flex-col">
      {showAvatar ? (
        <Avatar className="h-7 w-7 mt-auto mb-6">
          <AvatarImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/8787ee53ee3736297102ce7acdcdefb072be5aa7?placeholderIfAbsent=true" />
          <AvatarFallback>JA</AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-7 w-7" />
      )}
    </div>
  );
};