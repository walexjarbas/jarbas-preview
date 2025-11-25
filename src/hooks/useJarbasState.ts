import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';
import { PersonalizationField } from '@/types/personalization';

interface Guideline {
  id: string;
  title: string;
  description: string;
}

export interface JarbasState {
  selectedObjective: string;
  conversationType: string;
  requestEvaluation: boolean;
  personalizationFields: PersonalizationField[];
  guidelines: Guideline[];
  messages: Message[];
  useAI: boolean;
}

export interface JarbasStateManager {
  state: JarbasState;
  hasChanges: boolean;
  updateSelectedObjective: (objective: string) => void;
  updateConversationType: (type: string) => void;
  updateRequestEvaluation: (value: boolean) => void;
  updatePersonalizationFields: (fields: PersonalizationField[]) => void;
  updateGuidelines: (guidelines: Guideline[]) => void;
  updateMessages: (messages: Message[]) => void;
  updateUseAI: (value: boolean) => void;
  saveAllChanges: () => boolean;
  resetState: () => void;
}

const getInitialState = (): JarbasState => {
  try {
    // Load from localStorage
    const selectedObjective = localStorage.getItem('jarbas_selected_objective') || '';
    const conversationType = localStorage.getItem('jarbas_conversation_type') || 'proactive';
    const requestEvaluation = JSON.parse(localStorage.getItem('jarbas_request_evaluation') || 'false');
    const useAI = JSON.parse(localStorage.getItem('jarbas_msg_ai') || 'false');

    // Load personalization fields
    const savedFields = localStorage.getItem('jarbas_personalization_fields');
    let personalizationFields: PersonalizationField[] = [];
    if (savedFields) {
      const parsed = JSON.parse(savedFields);
      if (Array.isArray(parsed)) {
        personalizationFields = parsed.map((field: any) => ({
          id: String(field.id),
          selectedField: String(field.selectedField),
          value: String(field.value),
          isMandatory: Boolean(field.isMandatory)
        }));
      }
    }

    // Ensure "Nome" field is always present and first
    const hasNomeField = personalizationFields.some(field => field.selectedField === 'Nome' && field.isMandatory);
    if (!hasNomeField) {
      const nomeField: PersonalizationField = {
        id: 'nome-mandatory',
        selectedField: 'Nome',
        value: '',
        isMandatory: true
      };
      // Remove any existing Nome field that isn't mandatory
      personalizationFields = personalizationFields.filter(field => field.selectedField !== 'Nome');
      // Add mandatory Nome field at the beginning
      personalizationFields.unshift(nomeField);
    }

    // Load guidelines
    const savedGuidelines = localStorage.getItem('jarbas_guidelines');
    const guidelines: Guideline[] = savedGuidelines ? JSON.parse(savedGuidelines) : [];

    // Load messages
    const savedMessages = localStorage.getItem('jarbas_msg_list');
    let messages: Message[] = [];
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      if (Array.isArray(parsed)) {
        messages = parsed.map((msg: any) => ({
          id: msg.id,
          type: msg.type || 'text',
          content: msg.content,
          sender: msg.sender || 'bot',
          timestamp: new Date(msg.timestamp || Date.now()),
          status: msg.status || 'read',
          ...(msg.duration && { duration: msg.duration })
        }));
      }
    }

    // Default messages if none exist
    if (messages.length === 0) {
      messages = [
        {
          id: '1',
          type: 'text',
          content: 'Olá! Aqui é o Jarbas falando. Estou aqui para tirar suas dúvidas, mas você sempre pode falar com nossa equipe.',
          sender: 'bot',
          timestamp: new Date(),
          status: 'read'
        },
        {
          id: '2',
          type: 'text',
          content: 'Como posso te ajudar hoje?',
          sender: 'bot',
          timestamp: new Date(),
          status: 'read'
        }
      ];
    }

    return {
      selectedObjective,
      conversationType,
      requestEvaluation,
      personalizationFields,
      guidelines,
      messages,
      useAI
    };
  } catch (error) {
    console.error('Error loading initial state:', error);
    return {
      selectedObjective: '',
      conversationType: 'proactive',
      requestEvaluation: false,
      personalizationFields: [{
        id: 'nome-mandatory',
        selectedField: 'Nome',
        value: '',
        isMandatory: true
      }],
      guidelines: [],
      messages: [
        {
          id: '1',
          type: 'text',
          content: 'Olá! Aqui é o Jarbas falando. Estou aqui para tirar suas dúvidas, mas você sempre pode falar com nossa equipe.',
          sender: 'bot',
          timestamp: new Date(),
          status: 'read'
        },
        {
          id: '2',
          type: 'text',
          content: 'Como posso te ajudar hoje?',
          sender: 'bot',
          timestamp: new Date(),
          status: 'read'
        }
      ],
      useAI: false
    };
  }
};

// Helper to normalize state for comparison (excludes timestamps which vary)
const normalizeForComparison = (s: JarbasState) => ({
  ...s,
  messages: s.messages.map(m => ({ ...m, timestamp: undefined }))
});

export const useJarbasState = (): JarbasStateManager => {
  // Initialize both state and savedState from the same reference to prevent false hasChanges
  const [initialState] = useState<JarbasState>(() => getInitialState());
  const [state, setState] = useState<JarbasState>(initialState);
  const [savedState, setSavedState] = useState<JarbasState>(initialState);

  // Check if current state has changes compared to saved state (excluding timestamps)
  const hasChanges = JSON.stringify(normalizeForComparison(state)) !== JSON.stringify(normalizeForComparison(savedState));

  const updateSelectedObjective = useCallback((objective: string) => {
    setState(prev => ({ ...prev, selectedObjective: objective }));
  }, []);

  const updateConversationType = useCallback((type: string) => {
    setState(prev => ({ ...prev, conversationType: type }));
  }, []);

  const updateRequestEvaluation = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, requestEvaluation: value }));
  }, []);

  const updatePersonalizationFields = useCallback((fields: PersonalizationField[]) => {
    setState(prev => ({ ...prev, personalizationFields: fields }));
  }, []);

  const updateGuidelines = useCallback((guidelines: Guideline[]) => {
    setState(prev => ({ ...prev, guidelines: guidelines }));
  }, []);

  const updateMessages = useCallback((messages: Message[]) => {
    setState(prev => ({ ...prev, messages: messages }));
  }, []);

  const updateUseAI = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, useAI: value }));
  }, []);

  const saveAllChanges = useCallback(() => {
    try {
      // Validate personalization fields - skip mandatory fields (they can be empty)
      // Only validate non-mandatory fields that have a type selected but empty value
      const invalidFields = state.personalizationFields.filter(field =>
        field.selectedField &&
        field.selectedField.trim() !== '' &&
        !field.isMandatory && // Skip mandatory fields - they can be empty
        (!field.value || field.value.trim() === '' || field.value.trim() === 'undefined')
      );

      if (invalidFields.length > 0) {
        console.warn('❌ Cannot save: Some non-mandatory fields have a type selected but no value provided');
        return false;
      }

      // Create unified configuration object
      const unifiedConfig = {
        selectedObjective: state.selectedObjective,
        conversationType: state.conversationType,
        requestEvaluation: state.requestEvaluation,
        personalizationFields: state.personalizationFields,
        guidelines: state.guidelines,
        // Only save messages if useAI is false
        messages: state.useAI ? [] : state.messages.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        useAI: state.useAI,
        savedAt: new Date().toISOString()
      };

      // Save unified configuration
      localStorage.setItem('jarbas_complete_config', JSON.stringify(unifiedConfig));

      // Also save individual items for backward compatibility
      localStorage.setItem('jarbas_selected_objective', state.selectedObjective);
      localStorage.setItem('jarbas_conversation_type', state.conversationType);
      localStorage.setItem('jarbas_request_evaluation', JSON.stringify(state.requestEvaluation));
      localStorage.setItem('jarbas_personalization_fields', JSON.stringify(state.personalizationFields));
      localStorage.setItem('jarbas_guidelines', JSON.stringify(state.guidelines));
      localStorage.setItem('jarbas_msg_list', JSON.stringify(unifiedConfig.messages));
      localStorage.setItem('jarbas_msg_ai', JSON.stringify(state.useAI));

      // Update saved state to current state
      setSavedState({ ...state });

      console.log('✅ All changes saved successfully:', unifiedConfig);
      
      // Trigger update event for chat widget
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'jarbas_complete_config',
        newValue: JSON.stringify(unifiedConfig),
        storageArea: localStorage
      }));

      return true;
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      return false;
    }
  }, [state]);

  const resetState = useCallback(() => {
    const initialState = getInitialState();
    setState(initialState);
    setSavedState(initialState);
  }, []);

  return {
    state,
    hasChanges,
    updateSelectedObjective,
    updateConversationType,
    updateRequestEvaluation,
    updatePersonalizationFields,
    updateGuidelines,
    updateMessages,
    updateUseAI,
    saveAllChanges,
    resetState
  };
};