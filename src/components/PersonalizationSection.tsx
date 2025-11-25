import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, User } from 'lucide-react';
import { PersonalizationField } from './PersonalizationField';
import { fieldOptions } from '../constants/fieldOptions';
import { PersonalizationField as PersonalizationFieldType, FieldOption } from '@/types/personalization';
import { JarbasStateManager } from '@/hooks/useJarbasState';

interface PersonalizationSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  jarbasState: JarbasStateManager;
}

export const PersonalizationSection: React.FC<PersonalizationSectionProps> = ({
  isExpanded,
  onToggle,
  jarbasState,
}) => {
  // Use unified state instead of local state
  const fields = jarbasState.state.personalizationFields;
  const [customFields, setCustomFields] = useState<FieldOption[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);


  // Initialize custom fields from localStorage
  useEffect(() => {
    try {
      const storedCustomFields = localStorage.getItem('jarbas_custom_fields');
      let loadedCustomFields: FieldOption[] = [];

      if (storedCustomFields) {
        const parsed = JSON.parse(storedCustomFields);
        if (Array.isArray(parsed)) {
          // Recreate icon as a valid React element since it can't be serialized
          loadedCustomFields = parsed
            .filter(field => field && typeof field === 'object' && field.label)
            .map(field => ({
              label: field.label,
              icon: <Pencil className="h-4 w-4" />,
              isCustom: true
            }));
        }
      }
      setCustomFields(loadedCustomFields);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading custom fields:', error);
      setCustomFields([]);
      setIsInitialized(true);
    }
  }, []);

  // Save custom fields to localStorage (only save label, not the React icon element)
  useEffect(() => {
    if (!isInitialized) return;

    try {
      // Only save serializable data - not React elements
      const serializableFields = customFields.map(field => ({
        label: field.label,
        isCustom: field.isCustom
      }));
      localStorage.setItem('jarbas_custom_fields', JSON.stringify(serializableFields));
    } catch (error) {
      console.error('Error saving custom fields:', error);
    }
  }, [customFields, isInitialized]);


  const updateField = (id: string, updates: Partial<PersonalizationFieldType>) => {
    const updatedFields = fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    );
    jarbasState.updatePersonalizationFields(updatedFields);
  };

  const deleteField = (id: string) => {
    const filteredFields = fields.filter(field => field.id !== id);
    jarbasState.updatePersonalizationFields(filteredFields);
  };

  const addField = () => {
    const newField: PersonalizationFieldType = {
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      selectedField: '',
      value: ''
    };
    
    jarbasState.updatePersonalizationFields([...fields, newField]);
  };

  const addCustomField = (label: string) => {
    const newCustomField: FieldOption = {
      label: label,
      icon: <Pencil className="h-4 w-4" />,
      isCustom: true
    };
    
    setCustomFields(prev => [...prev, newCustomField]);
  };

  // Add "Nome" to available options
  const nomeOption: FieldOption = {
    label: 'Nome',
    icon: <User className="h-4 w-4" />
  };

  const allAvailableOptions = [nomeOption, ...fieldOptions, ...customFields];

  if (!isInitialized) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Quanto mais informações relevantes Jarbas tiver, melhor e mais personalizada será o diálogo.
      </p>
      
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          Campos personalizados
        </label>
        
        {fields.map((field) => (
          <PersonalizationField
            key={field.id}
            field={field}
            onUpdate={updateField}
            onDelete={deleteField}
            availableOptions={allAvailableOptions}
            onAddCustomField={addCustomField}
          />
        ))}
      </div>
      
      <div className="flex justify-start">
        <Button 
          variant="outline" 
          onClick={addField}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar campo
        </Button>
      </div>
    </div>
  );
};