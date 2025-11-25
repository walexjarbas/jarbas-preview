
import React from 'react';

interface BehaviorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BehaviorTabs: React.FC<BehaviorTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4 border-b border-border sm:gap-6">
      <button
        className={`relative pb-3 text-sm font-semibold transition-colors sm:text-base ${
          activeTab === 'behavior' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onTabChange('behavior')}
      >
        <span>Comportamento</span>
        {activeTab === 'behavior' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
        )}
      </button>
      <button
        className={`relative pb-3 text-sm font-semibold transition-colors sm:text-base ${
          activeTab === 'personalization' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => onTabChange('personalization')}
      >
        <span>Personalização</span>
        {activeTab === 'personalization' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
        )}
      </button>
    </div>
  );
};
