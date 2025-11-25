
import React from 'react';
import { User, FileText, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';

export const UserMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full sm:h-10 sm:w-10 lg:h-12 lg:w-12">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm">
            WM
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover border border-border shadow-lg">
        <div className="px-4 py-3 border-b border-border">
          <div className="font-semibold text-popover-foreground">Walex Mateus</div>
          <div className="text-sm text-muted-foreground">walex@jarbas.ai</div>
        </div>
        
        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2">
          <User className="h-4 w-4" />
          <span>Seu perfil</span>
        </DropdownMenuItem>
        
        <LanguageSelector />
        <ThemeSelector />
        
        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2">
          <FileText className="h-4 w-4" />
          <span>Termos e políticas</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
