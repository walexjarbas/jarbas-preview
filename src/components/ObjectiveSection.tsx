
import React from 'react';
import { ObjectiveCard } from './ObjectiveCard';
import { Objective } from '../data/objectives';

interface ObjectiveSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedObjective: string;
  onObjectiveChange: (id: string) => void;
  objectives: Objective[];
}

export const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({
  isExpanded,
  onToggle,
  selectedObjective,
  onObjectiveChange,
  objectives
}) => {
  return (
    <div className={`rounded-lg border bg-background p-4 transition-all sm:p-6 ${isExpanded ? 'border-black' : 'border-border min-h-[80px]'}`}>
      <button className="flex w-full items-center justify-between text-left" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec85a3ed190f14749c591dc851d9b079ed67016f?placeholderIfAbsent=true" className="h-5 w-5" alt="Objective Icon" />
          <span className="text-sm text-foreground sm:text-base font-semibold">
            Qual o objetivo da interação?
          </span>
        </div>
        <img src={isExpanded ? "https://cdn.builder.io/api/v1/image/assets/TEMP/71d0aa96b2bd63880973acce1c400956e89bbc9f?placeholderIfAbsent=true" : "https://cdn.builder.io/api/v1/image/assets/TEMP/a2ca2f944f6a7d9ca902201432ea1a0b06a08351?placeholderIfAbsent=true"} className="h-4 w-4" alt="Toggle Icon" />
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
          <div className="h-px bg-border" />
          
          <p className="text-sm text-foreground leading-tight">
            Escolha um Agente Especialista com foco no objetivo da sua demanda.
          </p>
          
          {objectives.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {objectives.map((objective) => (
                <ObjectiveCard
                  key={objective.id}
                  objective={objective}
                  isSelected={selectedObjective === objective.id}
                  onSelect={onObjectiveChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              Nenhum objetivo disponível para o tipo de conversa selecionado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
