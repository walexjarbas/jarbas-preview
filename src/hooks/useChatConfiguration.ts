import { useState, useEffect } from 'react';
import { JarbasConfiguration } from '@/types/jarbas';
import { JarbasState } from '@/hooks/useJarbasState';
import { Message } from '@/types/chat';

// Helper to reconstruct messages with proper Date objects
const reconstructMessages = (messages: any[]): Message[] => {
  return messages.map((msg: any) => ({
    id: msg.id,
    type: msg.type || 'text',
    content: msg.content,
    sender: msg.sender || 'bot',
    timestamp: new Date(msg.timestamp || Date.now()),
    status: msg.status || 'read',
    ...(msg.duration && { duration: msg.duration })
  }));
};

export const useChatConfiguration = () => {
  const [activeConfig, setActiveConfig] = useState<JarbasConfiguration | null>(null);
  const [jarbasState, setJarbasState] = useState<JarbasState | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  // Single consolidated effect for loading configuration and listening to storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        // Try to load from unified config first
        const savedConfig = localStorage.getItem('jarbas_complete_config');
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setJarbasState(config);

          // Load messages from config if available
          if (config.messages?.length > 0) {
            setInitialMessages(reconstructMessages(config.messages));
          }
          return;
        }

        // Fallback to jarbas_msg_list for backwards compatibility
        const savedMessages = localStorage.getItem('jarbas_msg_list');
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          setInitialMessages(reconstructMessages(parsedMessages));
        }
      } catch (error) {
        console.error('Error loading configuration:', error);
      }
    };

    // Load on mount
    handleStorageChange();

    // Listen for storage changes (single listener instead of multiple)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    activeConfig,
    setActiveConfig,
    jarbasState,
    setJarbasState,
    initialMessages,
    setInitialMessages
  };
};