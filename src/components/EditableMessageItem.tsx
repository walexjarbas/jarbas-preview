import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Paperclip, Image, GripVertical, Trash2 } from 'lucide-react';
import { Message } from '@/types/chat';

interface EditableMessageItemProps {
  message: Message;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export const EditableMessageItem: React.FC<EditableMessageItemProps> = ({
  message,
  onUpdate,
  onDelete,
}) => {
  const [content, setContent] = useState(message.content);
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: message.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate(content);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(message.content);
    setIsEditing(false);
  };

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 rounded-lg p-4 relative group ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
          <AvatarFallback className="bg-gray-800 text-white text-xs">
            JA
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px] resize-none border-gray-200 bg-white"
                placeholder="Digite sua mensagem..."
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="cursor-text"
              onClick={handleClick}
            >
              <p className="text-sm text-gray-900 leading-relaxed mb-3">
                {message.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-black hover:text-black hover:bg-gray-200"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-black hover:text-black hover:bg-gray-200"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-black hover:text-black hover:bg-gray-200 cursor-grab active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-black hover:text-black hover:bg-gray-200"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
