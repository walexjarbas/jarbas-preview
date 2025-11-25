
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconSend2, IconLoader2 } from '@tabler/icons-react';

interface ChatInitialStateProps {
  onStartConversation: () => void;
  isLoading?: boolean;
}

export const ChatInitialState: React.FC<ChatInitialStateProps> = ({
  onStartConversation,
  isLoading = false
}) => {
  return <div className="flex-1 flex flex-col justify-between px-6 py-8">
      <div className="flex-1 flex flex-col items-center justify-center my-0">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://cdn.builder.io/api/v1/image/assets/TEMP/54e93b543d41491f0d47db0bacae9af19334b46d?placeholderIfAbsent=true" />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        
        
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-foreground">
            Salve a personalização
          </p>
          <p className="text-base font-semibold text-foreground">
            e veja Jarbas em ação
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={onStartConversation} 
          disabled={isLoading}
          className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-3 text-sm font-medium disabled:opacity-50"
        >
          {isLoading ? (
            <>
              Iniciando interação... <IconLoader2 className="h-4 w-4 ml-2 animate-spin" />
            </>
          ) : (
            <>
              Começar uma conversa <IconSend2 className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>;
};
