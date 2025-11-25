
import React, { useState } from 'react';
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const LanguageSelector: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[1];
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-3 px-4 py-2">
        <span className="text-lg">{getCurrentLanguage().flag}</span>
        <span>English</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-48 bg-popover border border-border shadow-lg">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            className={`flex items-center gap-3 px-4 py-2 ${
              selectedLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage === language.code && (
              <span className="ml-auto">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
