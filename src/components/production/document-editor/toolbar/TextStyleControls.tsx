
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';

interface TextStyleControlsProps {
  onFormatAction: (command: string) => void;
}

export const TextStyleControls: React.FC<TextStyleControlsProps> = ({ onFormatAction }) => {
  return (
    <>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onFormatAction('bold')}>
        <Bold size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onFormatAction('italic')}>
        <Italic size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onFormatAction('underline')}>
        <Underline size={16} />
      </Button>
    </>
  );
};
