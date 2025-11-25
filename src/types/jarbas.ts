
import { Message } from './chat';
import { PersonalizationField } from './personalization';

export interface Guideline {
  id: string;
  title: string;
  description: string;
}

export interface JarbasConfiguration {
  objective_id: string | null;
  settings: {
    messages: Message[];
    ai_enabled: boolean;
    guidelines: Guideline[];
    personalization: {
      fields: PersonalizationField[];
      entry_mode: string;
    };
    conversation_type: string;
    request_evaluation: boolean;
  };
}

export interface JarbasConfigContextType {
  configuration: JarbasConfiguration;
  updateConfiguration: () => void;
  resetChatSession: () => void;
  isConfigurationValid: boolean;
}
