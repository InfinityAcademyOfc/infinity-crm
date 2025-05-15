
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Link, Code, Quote } from 'lucide-react';

interface InsertControlsProps {
  onFormatAction: (command: string, value?: string) => void;
}

export const InsertControls: React.FC<InsertControlsProps> = ({ onFormatAction }) => {
  return (
    <>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Image size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Link size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onFormatAction('formatBlock', '<pre>')}
      >
        <Code size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onFormatAction('formatBlock', '<blockquote>')}
      >
        <Quote size={16} />
      </Button>
    </>
  );
};
