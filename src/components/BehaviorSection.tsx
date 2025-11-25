
import React from 'react';
import { ConversationTypeSelector } from './ConversationTypeSelector';

interface BehaviorSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  conversationType: string;
  onConversationTypeChange: (type: string) => void;
  requestEvaluation: boolean;
  onRequestEvaluationChange: (value: boolean) => void;
}

export const BehaviorSection: React.FC<BehaviorSectionProps> = ({
  isExpanded,
  onToggle,
  conversationType,
  onConversationTypeChange,
  requestEvaluation,
  onRequestEvaluationChange
}) => {
  return (
    <div className={`rounded-lg border bg-background p-4 transition-all sm:p-6 ${isExpanded ? 'border-black min-h-[400px]' : 'border-border min-h-[80px]'}`}>
      <button className="flex w-full items-center justify-between text-left" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f2b2f34ebd7e9ab3660d7a1cff585b7707f7166?placeholderIfAbsent=true" className="h-5 w-5" alt="Behavior Icon" />
          <span className="text-sm text-foreground sm:text-base font-semibold">
            Como Jarbas deve se comportar?
          </span>
        </div>
        <img src={isExpanded ? "https://cdn.builder.io/api/v1/image/assets/TEMP/71d0aa96b2bd63880973acce1c400956e89bbc9f?placeholderIfAbsent=true" : "https://cdn.builder.io/api/v1/image/assets/TEMP/a2ca2f944f6a7d9ca902201432ea1a0b06a08351?placeholderIfAbsent=true"} className="h-4 w-4" alt="Toggle Icon" />
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
          <div className="h-px bg-border" />
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Defina se Jarbas deve entrar em contato proativamente com seu cliente ou se ele deve esperar uma interação inicial.
          </p>
          
          <ConversationTypeSelector 
            conversationType={conversationType}
            onConversationTypeChange={onConversationTypeChange}
          />
          
          <div className="h-px bg-border" />
          
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-3">
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${requestEvaluation ? 'bg-foreground' : 'bg-muted'}`}>
                <input type="checkbox" checked={requestEvaluation} onChange={e => onRequestEvaluationChange(e.target.checked)} className="sr-only" />
                <div className={`inline-block h-4 w-4 rounded-full bg-background transition-transform ${requestEvaluation ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">
                  Pedir avaliação ao final da interação
                </span>
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d967bf1ad53d8f7cd9ed350293cec9c8472917a?placeholderIfAbsent=true" className="h-3.5 w-3.5" alt="Info Icon" />
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
