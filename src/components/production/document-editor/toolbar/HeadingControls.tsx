
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Heading1, Heading2, Heading3 } from 'lucide-react';

interface HeadingControlsProps {
  onFormatAction: (command: string, value?: string) => void;
}

export const HeadingControls: React.FC<HeadingControlsProps> = ({ onFormatAction }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Heading1 size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onFormatAction('formatBlock', '<h1>')}>
          <Heading1 className="mr-2" size={16} /> Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFormatAction('formatBlock', '<h2>')}>
          <Heading2 className="mr-2" size={16} /> Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFormatAction('formatBlock', '<h3>')}>
          <Heading3 className="mr-2" size={16} /> Heading 3
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFormatAction('formatBlock', '<p>')}>
          Normal Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
