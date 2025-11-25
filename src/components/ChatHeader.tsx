
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  hasConversation: boolean;
  onReload: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ hasConversation, onReload }) => {
  return (
    <header className="flex items-center justify-between border-b border-border p-4">
      {!hasConversation ? (
        // Simple header for initial state - just centered "Jarbas"
        <div className="flex-1 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            Jarbas
          </h3>
        </div>
      ) : (
        // Full header for conversation state
        <>
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/54e93b543d41491f0d47db0bacae9af19334b46d?placeholderIfAbsent=true" />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Jarbas AI
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="rounded bg-foreground px-1 py-0.5 text-xs font-extrabold text-background">
                  IA
                </div>
                <span className="text-xs text-muted-foreground">agente</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onReload}>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7681a30d5d4896917a18cf40be74e3b81d621c1e?placeholderIfAbsent=true"
              className="h-5 w-5"
              alt="Reload"
            />
          </Button>
        </>
      )}
    </header>
  );
};
