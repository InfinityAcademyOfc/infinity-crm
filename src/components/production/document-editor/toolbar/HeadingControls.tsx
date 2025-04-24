
import React from 'react';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeadingControlsProps {
  handleFormatAction: (action: string) => void;
}

const HeadingControls: React.FC<HeadingControlsProps> = ({ handleFormatAction }) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('h1')} 
              aria-label="Heading 1"
            >
              <Heading1 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 1</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('h2')} 
              aria-label="Heading 2"
            >
              <Heading2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 2</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('h3')} 
              aria-label="Heading 3"
            >
              <Heading3 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 3</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('h4')} 
              aria-label="Heading 4"
            >
              <Heading4 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 4</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('h5')} 
              aria-label="Heading 5"
            >
              <Heading5 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 5</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('h6')} 
              aria-label="Heading 6"
            >
              <Heading6 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 6</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default HeadingControls;
