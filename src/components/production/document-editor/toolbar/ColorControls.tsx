
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';

interface ColorControlsProps {
  textColor: string;
  backgroundColor: string;
  onUpdateFormatting: (property: string, value: string) => void;
}

const colors = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Yellow', value: '#F59E0B' },
  { label: 'Green', value: '#10B981' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#8B5CF6' }
];

const backgrounds = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#F3F4F6' },
  { label: 'Light Yellow', value: '#FEF3C7' },
  { label: 'Light Green', value: '#D1FAE5' },
  { label: 'Light Blue', value: '#DBEAFE' },
  { label: 'Light Purple', value: '#EDE9FE' }
];

export const ColorControls: React.FC<ColorControlsProps> = ({
  textColor,
  backgroundColor,
  onUpdateFormatting
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: textColor }}></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Text Color</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <div className="grid grid-cols-4 gap-1 p-1">
              {colors.map((color) => (
                <div
                  key={color.value}
                  className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  onClick={() => onUpdateFormatting('textColor', color.value)}
                />
              ))}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Background Color</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <div className="grid grid-cols-4 gap-1 p-1">
              {backgrounds.map((bg) => (
                <div
                  key={bg.value}
                  className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: bg.value }}
                  onClick={() => onUpdateFormatting('backgroundColor', bg.value)}
                />
              ))}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
