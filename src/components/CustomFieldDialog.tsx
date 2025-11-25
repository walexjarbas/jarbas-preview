
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CustomFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomField: (label: string) => void;
}

export const CustomFieldDialog: React.FC<CustomFieldDialogProps> = ({
  isOpen,
  onClose,
  onAddCustomField,
}) => {
  const [customFieldName, setCustomFieldName] = useState('');

  const handleAddCustomField = () => {
    if (customFieldName.trim()) {
      onAddCustomField(customFieldName.trim());
      setCustomFieldName('');
      onClose();
    }
  };

  const handleClose = () => {
    setCustomFieldName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Adicionar Campo Personalizado</DialogTitle>
          <DialogDescription>
            Digite o nome do novo campo personalizado que deseja adicionar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome do campo</label>
            <Input
              value={customFieldName}
              onChange={(e) => setCustomFieldName(e.target.value)}
              placeholder="Ex.: Profissão"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomField();
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddCustomField}
              disabled={!customFieldName.trim()}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
