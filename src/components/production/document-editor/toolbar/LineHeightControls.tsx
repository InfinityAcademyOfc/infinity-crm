
import React from 'react';
import { AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface LineHeightControlsProps {
  lineHeight: string;
  handleFormatAction: (action: string, value: string) => void;
}

const LineHeightControls: React.FC<LineHeightControlsProps> = ({
  lineHeight,
  handleFormatAction
}) => {
  const lineHeights = ['1', '1.15', '1.5', '1.75', '2', '2.5', '3'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2 gap-1">
          {/* Using AlignJustify icon with custom rotation to represent line height */}
          <AlignJustify size={16} className="rotate-90" />
          <span className="text-xs">{lineHeight}×</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {lineHeights.map(height => (
            <DropdownMenuItem key={height} onClick={() => handleFormatAction('lineHeight', height)}>
              {height}×
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LineHeightControls;
