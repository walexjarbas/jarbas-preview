
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface CreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBrand: (brand: {
    name: string;
    subtitle: string;
    description: string;
  }) => void;
}

export const CreateBrandModal: React.FC<CreateBrandModalProps> = ({
  isOpen,
  onClose,
  onCreateBrand,
}) => {
  const [brandName, setBrandName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateBrand = () => {
    if (brandName.trim() && subtitle.trim()) {
      onCreateBrand({
        name: brandName.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
      });
      setBrandName('');
      setSubtitle('');
      setDescription('');
      onClose();
    }
  };

  const handleClose = () => {
    setBrandName('');
    setSubtitle('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Criar uma Marca</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Logo da Marca</label>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-300">
                  <div className="text-black text-lg font-bold">😊</div>
                </div>
                <Button variant="outline" className="text-gray-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Carregar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Marca</label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Digite o nome da marca"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subtítulo</label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Digite o subtítulo da marca"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição da Marca</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a marca..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateBrand}
              disabled={!brandName.trim() || !subtitle.trim()}
              className="bg-[#D0FF61] hover:bg-[#B8E654] text-black"
            >
              ✓ Criar marca
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
