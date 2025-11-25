
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Pencil } from 'lucide-react';
import { CustomFieldDialog } from './CustomFieldDialog';
import { PersonalizationField as PersonalizationFieldType, FieldOption } from '@/types/personalization';

interface PersonalizationFieldProps {
  field: PersonalizationFieldType;
  onUpdate: (id: string, updates: Partial<PersonalizationFieldType>) => void;
  onDelete: (id: string) => void;
  availableOptions: FieldOption[];
  onAddCustomField: (label: string) => void;
}

export const PersonalizationField: React.FC<PersonalizationFieldProps> = ({
  field,
  onUpdate,
  onDelete,
  availableOptions,
  onAddCustomField,
}) => {
  const [isCustomFieldDialogOpen, setIsCustomFieldDialogOpen] = useState(false);

  console.log('PersonalizationField: Rendering field:', field.id, field.selectedField);


  // Safety check for selected option
  const selectedOption = availableOptions?.find(opt => opt?.label === field.selectedField) || null;

  // Helper to safely render icon - only render if it's a valid React element
  const renderIcon = () => {
    if (!selectedOption?.icon) return null;
    // Check if the icon is a valid React element by checking if it has a valid type
    const icon = selectedOption.icon;
    if (React.isValidElement(icon)) {
      return icon;
    }
    // If it's a serialized object from localStorage, don't render it
    return null;
  };

  const handleAddCustomField = (label: string) => {
    if (!label || typeof label !== 'string') return;
    
    console.log('PersonalizationField: Adding custom field:', label);
    onAddCustomField(label);
    onUpdate(field.id, { selectedField: label });
  };

  const handleSelectChange = (value: string) => {
    if (!value) return;
    
    console.log('PersonalizationField: Select change:', value);
    
    if (value === 'add-custom') {
      setIsCustomFieldDialogOpen(true);
    } else {
      onUpdate(field.id, { selectedField: value });
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    console.log('PersonalizationField: Value change:', field.id, value);
    onUpdate(field.id, { value });
  };

  const handleDelete = () => {
    console.log('PersonalizationField: Deleting field:', field.id);
    onDelete(field.id);
  };

  return (
    <>
      <Card className="mb-3 border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              {field.isMandatory ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-border rounded-md">
                  {renderIcon()}
                  <span className="text-sm">{field.selectedField}</span>
                </div>
              ) : (
                <Select value={field.selectedField} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-background border-border">
                    <div className="flex items-center gap-2">
                      {renderIcon()}
                      <SelectValue placeholder="Selecione um campo..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-border shadow-lg z-50">
                    {availableOptions?.map((option) => (
                      <SelectItem key={option.label} value={option.label}>
                        <span>{option.label}</span>
                      </SelectItem>
                    ))}
                    <SelectItem value="add-custom">
                      <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <Pencil className="h-4 w-4" />
                        <span>Campo personalizado</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Input
                placeholder="Insira o valor..."
                value={field.value || ''}
                onChange={handleValueChange}
                className="bg-background border-border"
              />
            </div>
            
            {!field.isMandatory && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            {field.isMandatory && (
              <div className="w-8 h-8"></div>
            )}
          </div>
        </CardContent>
      </Card>

      <CustomFieldDialog
        isOpen={isCustomFieldDialogOpen}
        onClose={() => setIsCustomFieldDialogOpen(false)}
        onAddCustomField={handleAddCustomField}
      />
    </>
  );
};
