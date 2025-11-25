
import React from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EditableMessageItem } from './EditableMessageItem';
import { Message } from '@/types/chat';

interface EditableMessageListProps {
  messages: Message[];
  onUpdateMessage: (id: string, content: string) => void;
  onDeleteMessage: (id: string) => void;
  onReorderMessages: (messages: Message[]) => void;
}

export const EditableMessageList: React.FC<EditableMessageListProps> = ({
  messages,
  onUpdateMessage,
  onDeleteMessage,
  onReorderMessages,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = messages.findIndex((message) => message.id === active.id);
      const newIndex = messages.findIndex((message) => message.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newMessages = arrayMove(messages, oldIndex, newIndex);
        onReorderMessages(newMessages);
      }
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newMessages = [...messages];
      [newMessages[index - 1], newMessages[index]] = [newMessages[index], newMessages[index - 1]];
      onReorderMessages(newMessages);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < messages.length - 1) {
      const newMessages = [...messages];
      [newMessages[index], newMessages[index + 1]] = [newMessages[index + 1], newMessages[index]];
      onReorderMessages(newMessages);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={messages.map(m => m.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <EditableMessageItem
              key={message.id}
              message={message}
              onUpdate={(content) => onUpdateMessage(message.id, content)}
              onDelete={() => onDeleteMessage(message.id)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < messages.length - 1}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
