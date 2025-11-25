
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { GuidelineItem } from './GuidelineItem';
import { Guideline } from '@/types/guidelines';

interface GuidelinesSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  jarbasState: import('@/hooks/useJarbasState').JarbasStateManager;
}

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({
  isExpanded,
  onToggle,
  jarbasState,
}) => {
  // Use unified state instead of local state
  const guidelines = jarbasState.state.guidelines;

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addGuideline = () => {
    if (newTitle.trim() || newDescription.trim()) {
      const newGuideline: Guideline = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        description: newDescription.trim(),
      };
      jarbasState.updateGuidelines([...guidelines, newGuideline]);
      setNewTitle('');
      setNewDescription('');
      setIsDialogOpen(false);
    }
  };

  const editGuideline = (id: string, title: string, description: string) => {
    const updatedGuidelines = guidelines.map(item =>
      item.id === id ? { ...item, title, description } : item
    );
    jarbasState.updateGuidelines(updatedGuidelines);
  };

  const deleteGuideline = (id: string) => {
    const filteredGuidelines = guidelines.filter(item => item.id !== id);
    jarbasState.updateGuidelines(filteredGuidelines);
  };

  return (
    <div className={`rounded-lg border bg-background p-4 transition-all sm:p-6 ${isExpanded ? 'border-black' : 'border-border min-h-[80px]'}`}>
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f06037a1d3c87470b6ad7eb11fbb0c28f21e31bd?placeholderIfAbsent=true"
            className="h-5 w-5"
            alt="Guidelines Icon"
          />
          <span className="text-sm text-foreground sm:text-base font-semibold">
            Orientações
          </span>
        </div>
        <img
          src={isExpanded ? "https://cdn.builder.io/api/v1/image/assets/TEMP/71d0aa96b2bd63880973acce1c400956e89bbc9f?placeholderIfAbsent=true" : "https://cdn.builder.io/api/v1/image/assets/TEMP/a2ca2f944f6a7d9ca902201432ea1a0b06a08351?placeholderIfAbsent=true"}
          className="h-4 w-4"
          alt="Toggle Icon"
        />
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
          <div className="h-px bg-border" />
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Conte para Jarbas sobre condições específicas que ele deve lidar conforme a interação.
          </p>
          
          {guidelines.map((guideline) => (
            <GuidelineItem
              key={guideline.id}
              guideline={guideline}
              onEdit={editGuideline}
              onDelete={deleteGuideline}
            />
          ))}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar orientações
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Orientação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex.: Usuário com intenção de compra"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Ex.: Caso o usuário já esteja convencido de assinar um plano, transfira para o atendente com um resumo da conversa e um..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addGuideline}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
