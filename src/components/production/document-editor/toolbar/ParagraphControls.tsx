
import React from 'react';
import { Pilcrow, Link, Bookmark, FileText, FootprintsIcon, Indent, Outdent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParagraphControlsProps {
  handleFormatAction: (action: string) => void;
}

const ParagraphControls: React.FC<ParagraphControlsProps> = ({ handleFormatAction }) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('paragraph')} 
              aria-label="Paragraph"
            >
              <Pilcrow size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paragraph</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('link')} 
              aria-label="Insert Link"
            >
              <Link size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('bookmark')} 
              aria-label="Insert Bookmark"
            >
              <Bookmark size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert Bookmark</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('page-break')} 
              aria-label="Page Break"
            >
              <FileText size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Page Break</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('footer')} 
              aria-label="Footer"
            >
              <FootprintsIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Footer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('indent')} 
              aria-label="Indent"
            >
              <Indent size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Indent</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleFormatAction('outdent')} 
              aria-label="Outdent"
            >
              <Outdent size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Outdent</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default ParagraphControls;
