import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash } from 'lucide-react';
import { Guideline } from '@/types/guidelines';

interface GuidelineItemProps {
  guideline: Guideline;
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
}

export const GuidelineItem: React.FC<GuidelineItemProps> = ({ guideline, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(guideline.title);
  const [editDescription, setEditDescription] = useState(guideline.description);

  const handleSave = () => {
    onEdit(guideline.id, editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(guideline.title);
    setEditDescription(guideline.description);
    setIsEditing(false);
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-3">
            {isEditing ? (
              <>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Ex.: Usuário com intenção de compra"
                  className="font-medium"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Ex.: Caso o usuário já esteja convencido de assinar um plano, transfira para o atendente com um resumo da conversa e um..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="font-medium text-foreground">
                  {guideline.title || "Título não definido"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {guideline.description || "Descrição não definida"}
                </div>
              </>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(guideline.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};