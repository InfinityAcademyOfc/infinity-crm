
import React from 'react';
import { Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface FontControlsProps {
  fontFamily: string;
  fontSize?: string;
  handleFormatAction: (action: string, value: string) => void;
}

const FontControls: React.FC<FontControlsProps> = ({
  fontFamily,
  fontSize = '16px',
  handleFormatAction
}) => {
  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
  const fontFamilies = ['Inter', 'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana'];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-2 gap-1">
            <Type size={16} />
            <span className="text-xs">{fontFamily}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {fontFamilies.map(font => (
              <DropdownMenuItem key={font} onClick={() => handleFormatAction('fontFamily', font)}>
                <span style={{ fontFamily: font }}>{font}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="px-2 gap-1">
            <span className="text-xs">{fontSize}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {fontSizes.map(size => (
              <DropdownMenuItem key={size} onClick={() => handleFormatAction('fontSize', size)}>
                {size}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FontControls;
