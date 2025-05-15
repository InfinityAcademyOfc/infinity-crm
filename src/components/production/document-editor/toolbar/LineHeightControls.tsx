
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';

interface LineHeightControlsProps {
  lineHeight: string;
  onUpdateFormatting: (property: string, value: string) => void;
}

const lineHeights = [
  { label: 'Default', value: '1.5' },
  { label: 'Tight', value: '1.25' },
  { label: 'Relaxed', value: '1.75' },
  { label: 'Loose', value: '2' }
];

export const LineHeightControls: React.FC<LineHeightControlsProps> = ({
  lineHeight,
  onUpdateFormatting
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          Line Height
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup 
          value={lineHeight} 
          onValueChange={(value) => onUpdateFormatting('lineHeight', value)}
        >
          {lineHeights.map((height) => (
            <DropdownMenuRadioItem key={height.value} value={height.value}>
              {height.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
