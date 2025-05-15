
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

interface AlignmentControlsProps {
  textAlignment: string;
  onUpdateFormatting: (property: string, value: string) => void;
}

export const AlignmentControls: React.FC<AlignmentControlsProps> = ({
  textAlignment,
  onUpdateFormatting
}) => {
  return (
    <>
      <Button 
        variant={textAlignment === 'left' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => onUpdateFormatting('textAlignment', 'left')}
      >
        <AlignLeft size={16} />
      </Button>
      <Button 
        variant={textAlignment === 'center' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => onUpdateFormatting('textAlignment', 'center')}
      >
        <AlignCenter size={16} />
      </Button>
      <Button 
        variant={textAlignment === 'right' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => onUpdateFormatting('textAlignment', 'right')}
      >
        <AlignRight size={16} />
      </Button>
      <Button 
        variant={textAlignment === 'justify' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => onUpdateFormatting('textAlignment', 'justify')}
      >
        <AlignJustify size={16} />
      </Button>
    </>
  );
};
