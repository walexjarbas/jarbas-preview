
import React from 'react';

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  hasChanges: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, onSave, hasChanges }) => {
  return (
    <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-start">
      <button
        onClick={onCancel}
        className="rounded-md bg-muted px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80 sm:px-6"
      >
        Cancelar
      </button>
      <button
        onClick={onSave}
        disabled={!hasChanges}
        className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors sm:px-6 ${
          hasChanges 
            ? 'bg-[#D0FF61] text-black hover:bg-[#c5f555]' 
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b8be1c24ff899e433af1ccd5713f294b32ee226?placeholderIfAbsent=true"
          className="h-4 w-4"
          alt="Save Icon"
        />
        <span>Salvar alterações</span>
      </button>
    </div>
  );
};
