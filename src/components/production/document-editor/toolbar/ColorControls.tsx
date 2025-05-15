
import React from 'react';
import { Palette, HighlighterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface ColorControlsProps {
  handleFormatAction: (action: string) => void;
  currentTextColor?: string;
  currentBackgroundColor?: string;
}

const ColorControls: React.FC<ColorControlsProps> = ({ 
  handleFormatAction, 
  currentTextColor = 'default',
  currentBackgroundColor = 'default' 
}) => {
  const colors = ['default', 'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'black', 'white'];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Text Color" style={{color: currentTextColor !== 'default' ? currentTextColor : undefined}}>
            <Palette size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {colors.map(color => (
              <DropdownMenuItem 
                key={color} 
                onClick={() => handleFormatAction(`color-${color}`)}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full ${color === 'default' ? 'bg-black dark:bg-white' : ''}`} 
                     style={{backgroundColor: color !== 'default' ? color : undefined}}></div>
                <span className="capitalize">{color}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Highlight Color">
            <HighlighterIcon size={16} className="relative" />
            {currentBackgroundColor !== 'default' && currentBackgroundColor !== 'transparent' && (
              <span 
                className="absolute bottom-1 right-1 w-2 h-2 rounded-full" 
                style={{backgroundColor: currentBackgroundColor}}
              ></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {colors.map(color => (
              <DropdownMenuItem 
                key={color} 
                onClick={() => handleFormatAction(`bg-${color}`)}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full ${color === 'default' ? 'bg-transparent border border-gray-200' : ''}`}
                     style={{backgroundColor: color !== 'default' ? `${color}40` : undefined}}></div>
                <span className="capitalize">{color}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ColorControls;
