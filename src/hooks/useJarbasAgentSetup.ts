
import { useState, useCallback, useEffect } from 'react';
import { JarbasConfiguration } from '@/types/jarbas';
import { Message } from '@/types/chat';
import { PersonalizationField } from '@/types/personalization';

interface Guideline {
  id: string;
  title: string;
  description: string;
}

export const useJarbasAgentSetup = () => {
  const [configuration, setConfiguration] = useState<JarbasConfiguration>({
    objective_id: null,
    settings: {
      messages: [],
      ai_enabled: false,
      guidelines: [],
      personalization: {
        fields: [],
        entry_mode: 'nunca'
      },
      conversation_type: 'proactive',
      request_evaluation: false
    }
  });

  const [isConfigurationValid, setIsConfigurationValid] = useState(false);

  // Load configuration from localStorage
  const loadConfiguration = useCallback((): JarbasConfiguration => {
    try {
      // Load objective ID
      const assistantId = localStorage.getItem('jarbas_selected_objective');
      
      // Load messages
      const savedMessages = localStorage.getItem('jarbas_msg_list');
      let messages: Message[] = [];
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        messages = parsedMessages.map((msg: any) => ({
          id: msg.id,
          type: msg.type || 'text',
          content: msg.content,
          sender: msg.sender || 'bot',
          timestamp: new Date(msg.timestamp || Date.now()),
          status: msg.status || 'read',
          ...(msg.duration && { duration: msg.duration })
        }));
      }

      // Load AI enabled flag
      const aiEnabledStr = localStorage.getItem('jarbas_msg_ai');
      const aiEnabled = aiEnabledStr ? JSON.parse(aiEnabledStr) : false;

      // Load guidelines
      const savedGuidelines = localStorage.getItem('jarbas_guidelines');
      const guidelines: Guideline[] = savedGuidelines ? JSON.parse(savedGuidelines) : [];

      // Load personalization fields
      const savedFields = localStorage.getItem('jarbas_personalization_fields');
      let personalizationFields: PersonalizationField[] = [];
      if (savedFields) {
        const parsedFields = JSON.parse(savedFields);
        personalizationFields = parsedFields.map((field: any) => ({
          id: field.id,
          selectedField: field.selectedField,
          value: field.value,
          isMandatory: field.isMandatory || false
        }));
      }

      // Load entry mode
      const entryMode = localStorage.getItem('jarbas_entry_mode') || 'nunca';

      // Load behavior settings
      const conversationType = localStorage.getItem('jarbas_conversation_type') || 'proactive';
      const requestEvaluationStr = localStorage.getItem('jarbas_request_evaluation');
      const requestEvaluation = requestEvaluationStr ? JSON.parse(requestEvaluationStr) : false;

      const config: JarbasConfiguration = {
        objective_id: assistantId,
        settings: {
          messages,
          ai_enabled: aiEnabled,
          guidelines,
          personalization: {
            fields: personalizationFields,
            entry_mode: entryMode
          },
          conversation_type: conversationType,
          request_evaluation: requestEvaluation
        }
      };

      console.log('Loaded Jarbas configuration:', config);
      return config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return configuration;
    }
  }, [configuration]);

  // Update configuration from localStorage
  const updateConfiguration = useCallback(() => {
    const newConfig = loadConfiguration();
    setConfiguration(newConfig);
    
    // Validate configuration
    const isValid = !!(newConfig.objective_id && newConfig.settings.messages.length > 0);
    setIsConfigurationValid(isValid);
    
    console.log('Configuration updated:', newConfig);
    console.log('Configuration is valid:', isValid);
  }, [loadConfiguration]);

  // Reset chat session with new configuration
  const resetChatSession = useCallback(() => {
    console.log('Resetting chat session with configuration:', configuration);
    
    // Trigger a storage event to notify the ChatWidget
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'jarbas_config_update',
      newValue: JSON.stringify(configuration),
      storageArea: localStorage
    }));
    
    // Save the complete configuration for the chat widget
    localStorage.setItem('jarbas_active_config', JSON.stringify(configuration));
    
    return configuration;
  }, [configuration]);

  // Load configuration on mount
  useEffect(() => {
    updateConfiguration();
  }, [updateConfiguration]);

  return {
    configuration,
    updateConfiguration,
    resetChatSession,
    isConfigurationValid
  };
};
