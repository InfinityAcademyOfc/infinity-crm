
import React from 'react';
import { List, ListOrdered, ListChecks, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ListControlsProps {
  handleFormatAction: (action: string) => void;
}

const ListControls: React.FC<ListControlsProps> = ({ handleFormatAction }) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('bullet-list')} 
              aria-label="Bullet List"
            >
              <List size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('numbered-list')} 
              aria-label="Numbered List"
            >
              <ListOrdered size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('check-list')} 
              aria-label="Check List"
            >
              <ListChecks size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check List</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('todo-list')} 
              aria-label="Todo List"
            >
              <ListTodo size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Todo List</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ListControls;
