
import React, { useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const ThemeSelector: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('light');

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const getThemeIcon = () => {
    switch (selectedTheme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-3 px-4 py-2">
        {getThemeIcon()}
        <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-48 bg-popover border border-border shadow-lg">
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className={`flex items-center gap-3 px-4 py-2 ${
            selectedTheme === 'light' ? 'bg-accent' : ''
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {selectedTheme === 'light' && (
            <span className="ml-auto">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center gap-3 px-4 py-2 ${
            selectedTheme === 'dark' ? 'bg-accent' : ''
          }`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {selectedTheme === 'dark' && (
            <span className="ml-auto">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className={`flex items-center gap-3 px-4 py-2 ${
            selectedTheme === 'system' ? 'bg-accent' : ''
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {selectedTheme === 'system' && (
            <span className="ml-auto">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
