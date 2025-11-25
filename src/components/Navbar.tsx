
import React from 'react';
import { BrandSelector } from './BrandSelector';
import { UserMenu } from './UserMenu';

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-border bg-background px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ccd292f9ab18a634e1ef0b13668d784d063776d3?placeholderIfAbsent=true"
            className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
            alt="Jarbas AI Logo"
          />
          <h1 className="text-lg font-bold text-foreground sm:text-xl lg:text-2xl">
            Jarbas AI
          </h1>
          <div className="hidden rounded-full bg-[#D0FF61] px-2 py-1 text-xs font-semibold text-black sm:block">
            Agents Preview
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <BrandSelector />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};
