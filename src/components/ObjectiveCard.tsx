
import React from 'react';
import { IconMessageDots, IconMoneybag, IconMessageDollar, IconUserPlus, IconFlag, IconListSearch, IconHeadset, IconCalendar, IconShoppingCart } from '@tabler/icons-react';

interface Objective {
  id: string;
  title: string;
  description: string;
  icon: string;
  conversationType: 'proactive' | 'reactive';
}

interface ObjectiveCardProps {
  objective: Objective;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const getIconComponent = (iconName: string) => {
  const iconMap: {
    [key: string]: React.ComponentType<any>;
  } = {
    'message-dots': IconMessageDots,
    'moneybag-plus': IconMoneybag,
    'message-dollar': IconMessageDollar,
    'user-plus': IconUserPlus,
    'flag': IconFlag,
    'list-search': IconListSearch,
    'headset': IconHeadset,
    'calendar': IconCalendar,
    'shopping-cart': IconShoppingCart
  };
  return iconMap[iconName] || IconMessageDots;
};

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  isSelected,
  onSelect
}) => {
  const IconComponent = getIconComponent(objective.icon);
  
  const handleSelect = () => {
    onSelect(objective.id);
    console.log('Selected objective:', objective.id);
  };
  
  return (
    <label className={`block cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md h-full ${isSelected ? 'border-foreground bg-[#F6FFDF]' : 'border-border bg-background hover:border-muted-foreground'}`}>
      <input type="radio" name="objective" value={objective.id} checked={isSelected} onChange={handleSelect} className="sr-only" />
      <div className="flex flex-col gap-3 h-full">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#D0FF61]' : 'bg-[#F6FFDF]'}`}>
          <IconComponent size={20} className="text-foreground" />
        </div>
        <div className="space-y-2 flex-grow">
          <h3 className="text-base text-foreground font-semibold">
            {objective.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-tight font-normal">
            {objective.description}
          </p>
        </div>
      </div>
    </label>
  );
};
