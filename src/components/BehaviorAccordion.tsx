
import React, { useState } from 'react';
import { BehaviorSection } from './BehaviorSection';
import { GuidelinesSection } from './GuidelinesSection';
import { MessageSection } from './MessageSection';
import { ObjectiveSection } from './ObjectiveSection';
import { objectives } from '../data/objectives';
import { JarbasStateManager } from '@/hooks/useJarbasState';

interface BehaviorAccordionProps {
  jarbasState: JarbasStateManager;
}

export const BehaviorAccordion: React.FC<BehaviorAccordionProps> = ({ jarbasState }) => {
  const [expandedSections, setExpandedSections] = useState<{
    behavior: boolean;
    guidelines: boolean;
    message: boolean;
    objective: boolean;
  }>({
    behavior: false,
    guidelines: false,
    message: false,
    objective: false,
  });

  // Get values from unified state
  const { conversationType, requestEvaluation, selectedObjective } = jarbasState.state;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Filter objectives based on conversation type
  const filteredObjectives = objectives.filter(objective => 
    objective.conversationType === conversationType
  );

  return (
    <div className="space-y-4">
      <BehaviorSection
        isExpanded={expandedSections.behavior}
        onToggle={() => toggleSection('behavior')}
        conversationType={conversationType}
        onConversationTypeChange={jarbasState.updateConversationType}
        requestEvaluation={requestEvaluation}
        onRequestEvaluationChange={jarbasState.updateRequestEvaluation}
      />
      
      <ObjectiveSection
        isExpanded={expandedSections.objective}
        onToggle={() => toggleSection('objective')}
        selectedObjective={selectedObjective}
        onObjectiveChange={jarbasState.updateSelectedObjective}
        objectives={filteredObjectives}
      />
      
      <MessageSection
        isExpanded={expandedSections.message}
        onToggle={() => toggleSection('message')}
        jarbasState={jarbasState}
      />
      
      <GuidelinesSection
        isExpanded={expandedSections.guidelines}
        onToggle={() => toggleSection('guidelines')}
        jarbasState={jarbasState}
      />
    </div>
  );
};
