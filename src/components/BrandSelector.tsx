
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateBrandModal } from './CreateBrandModal';

export const BrandSelector: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState('pinnpet');
  const [isCreateBrandModalOpen, setIsCreateBrandModalOpen] = useState(false);

  const getBrandAvatar = (brand: string) => {
    switch (brand) {
      case 'pinnpet':
        return { bg: 'bg-[#8B5CF6]', text: 'PP', label: 'Pinn Pet' };
      case 'jarbas':
        return { bg: 'bg-[#84CC16]', text: 'J', label: 'Jarbas AI' };
      case 'bermuderia':
        return { bg: 'bg-[#EF4444]', text: 'B', label: 'Bermuderia' };
      default:
        return { bg: 'bg-[#8B5CF6]', text: 'PP', label: 'Pinn Pet' };
    }
  };

  const handleCreateBrand = (brand: { name: string; subtitle: string; description: string }) => {
    console.log('Creating brand:', brand);
    // Here you would typically save the brand to your backend/state management
    // For now, we'll just log it
  };

  return (
    <>
      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 w-auto min-w-[160px] h-auto">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getBrandAvatar(selectedBrand).bg} text-sm font-bold text-white`}>
              {getBrandAvatar(selectedBrand).text}
            </div>
            <span>{getBrandAvatar(selectedBrand).label}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="w-[200px] bg-popover border border-border shadow-lg z-50">
          <SelectItem value="pinnpet" className="flex items-center gap-3 p-3">
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8B5CF6] text-sm font-bold text-white">
                PP
              </div>
              <span className="flex-1">Pinn Pet</span>
            </div>
          </SelectItem>
          <SelectItem value="jarbas" className="flex items-center gap-3 p-3">
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#84CC16] text-sm font-bold text-white">
                J
              </div>
              <span className="flex-1">Jarbas AI</span>
            </div>
          </SelectItem>
          <SelectItem value="bermuderia" className="flex items-center gap-3 p-3">
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EF4444] text-sm font-bold text-white">
                B
              </div>
              <span className="flex-1">Bermuderia</span>
            </div>
          </SelectItem>
          <div className="border-t border-border my-1">
            <button
              onClick={() => setIsCreateBrandModalOpen(true)}
              className="flex items-center gap-3 w-full p-3 text-left hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
                <Plus className="h-4 w-4 text-gray-500" />
              </div>
              <span className="flex-1 text-gray-600">Criar marca</span>
            </button>
          </div>
        </SelectContent>
      </Select>

      <CreateBrandModal
        isOpen={isCreateBrandModalOpen}
        onClose={() => setIsCreateBrandModalOpen(false)}
        onCreateBrand={handleCreateBrand}
      />
    </>
  );
};
