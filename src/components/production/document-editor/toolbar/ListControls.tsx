
import React from 'react';
import { Button } from '@/components/ui/button';
import { List, ListOrdered, CheckSquare } from 'lucide-react';

interface ListControlsProps {
  onFormatAction: (command: string, value?: string) => void;
}

export const ListControls: React.FC<ListControlsProps> = ({ onFormatAction }) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onFormatAction('insertUnorderedList')}
      >
        <List size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onFormatAction('insertOrderedList')}
      >
        <ListOrdered size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => onFormatAction('insertHTML', '<div class="task-item"><input type="checkbox"> <span contenteditable="true">Task item</span></div>')}
      >
        <CheckSquare size={16} />
      </Button>
    </>
  );
};
