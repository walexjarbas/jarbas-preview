
import React from 'react';

interface ConversationTypeSelectorProps {
  conversationType: string;
  onConversationTypeChange: (type: string) => void;
}

export const ConversationTypeSelector: React.FC<ConversationTypeSelectorProps> = ({
  conversationType,
  onConversationTypeChange
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md sm:p-6 ${conversationType === 'proactive' ? 'border-foreground bg-[#F6FFDF]' : 'border-border bg-background hover:border-muted-foreground'}`}>
        <input 
          type="radio" 
          name="conversationType" 
          value="proactive" 
          checked={conversationType === 'proactive'} 
          onChange={e => onConversationTypeChange(e.target.value)} 
          className="sr-only" 
        />
        <div className="flex flex-col items-center text-center">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/22b7c13efc85f09a6ba17b633341d56f334494e1?placeholderIfAbsent=true" className="mb-3 h-8 w-8" alt="Proactive Icon" />
          <h3 className="mb-2 text-base font-semibold text-foreground">
            Conversas Proativas
          </h3>
          <p className="text-sm text-muted-foreground">
            Você entre em contato com seu cliente
          </p>
        </div>
      </label>
      
      <label className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md sm:p-6 ${conversationType === 'reactive' ? 'border-foreground bg-[#F6FFDF]' : 'border-border bg-background hover:border-muted-foreground'}`}>
        <input 
          type="radio" 
          name="conversationType" 
          value="reactive" 
          checked={conversationType === 'reactive'} 
          onChange={e => onConversationTypeChange(e.target.value)} 
          className="sr-only" 
        />
        <div className="flex flex-col items-center text-center">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0ce089f3706dc24bf5cbb5bd60305da79ea165e?placeholderIfAbsent=true" className="mb-3 h-8 w-8" alt="Reactive Icon" />
          <h3 className="mb-2 text-base font-semibold text-foreground">
            Conversas Reativas
          </h3>
          <p className="text-sm text-muted-foreground">
            Seu cliente entra em contato primeiro
          </p>
        </div>
      </label>
    </div>
  );
};
