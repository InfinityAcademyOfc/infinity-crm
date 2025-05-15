
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

interface FontFamilyControlsProps {
  fontFamily: string;
  onUpdateFormatting: (property: string, value: string) => void;
}

const fonts = [
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Roboto', value: '"Roboto", sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'monospace' }
];

export const FontFamilyControls: React.FC<FontFamilyControlsProps> = ({
  fontFamily,
  onUpdateFormatting
}) => {
  const currentFont = fonts.find(font => font.value === fontFamily) || fonts[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          {currentFont.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {fonts.map((font) => (
          <DropdownMenuItem 
            key={font.value}
            onClick={() => onUpdateFormatting('fontFamily', font.value)}
            style={{ fontFamily: font.value }}
          >
            {font.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
