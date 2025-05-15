
import React from 'react';
import { Link as LinkIcon, Image, Quote, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaControlsProps {
  handleFormatAction: (action: string) => void;
}

const MediaControls: React.FC<MediaControlsProps> = ({ handleFormatAction }) => {
  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => handleFormatAction('link')} title="Insert Link">
        <LinkIcon size={16} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleFormatAction('image')} title="Insert Image">
        <Image size={16} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleFormatAction('quote')} title="Quote">
        <Quote size={16} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleFormatAction('code')} title="Code Block">
        <Code size={16} />
      </Button>
    </>
  );
};

export default MediaControls;
