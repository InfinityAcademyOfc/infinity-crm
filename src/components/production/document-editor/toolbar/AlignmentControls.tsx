
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlignmentControlsProps {
  handleFormatAction: (action: string) => void;
  currentAlignment?: string;
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({ 
  handleFormatAction,
  currentAlignment = 'left'
}) => {
  return (
    <>
      <Button 
        variant={currentAlignment === 'left' ? "default" : "ghost"} 
        size="icon" 
        onClick={() => handleFormatAction('align-left')} 
        title="Align Left"
      >
        <AlignLeft size={16} />
      </Button>
      <Button 
        variant={currentAlignment === 'center' ? "default" : "ghost"} 
        size="icon" 
        onClick={() => handleFormatAction('align-center')} 
        title="Align Center"
      >
        <AlignCenter size={16} />
      </Button>
      <Button 
        variant={currentAlignment === 'right' ? "default" : "ghost"} 
        size="icon" 
        onClick={() => handleFormatAction('align-right')} 
        title="Align Right"
      >
        <AlignRight size={16} />
      </Button>
      <Button 
        variant={currentAlignment === 'justify' ? "default" : "ghost"} 
        size="icon" 
        onClick={() => handleFormatAction('align-justify')} 
        title="Justify"
      >
        <AlignJustify size={16} />
      </Button>
    </>
  );
};

export default AlignmentControls;
