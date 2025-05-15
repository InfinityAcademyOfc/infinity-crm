
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Link,
  Code,
  Quote,
  CheckSquare,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

interface FormatToolbarProps {
  fontFamily: string;
  textColor?: string;
  backgroundColor?: string;
  textAlignment?: string;
  lineHeight?: string;
  isPreviewMode?: boolean;
  onUpdateFormatting?: (property: string, value: string) => void;
  onTogglePreview?: () => void;
  onCopy?: () => void;
}

const fonts = [
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Roboto', value: '"Roboto", sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Monospace', value: 'monospace' }
];

const colors = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Yellow', value: '#F59E0B' },
  { label: 'Green', value: '#10B981' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#8B5CF6' }
];

const backgrounds = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#F3F4F6' },
  { label: 'Light Yellow', value: '#FEF3C7' },
  { label: 'Light Green', value: '#D1FAE5' },
  { label: 'Light Blue', value: '#DBEAFE' },
  { label: 'Light Purple', value: '#EDE9FE' }
];

const lineHeights = [
  { label: 'Default', value: '1.5' },
  { label: 'Tight', value: '1.25' },
  { label: 'Relaxed', value: '1.75' },
  { label: 'Loose', value: '2' }
];

const FormatToolbar: React.FC<FormatToolbarProps> = ({
  fontFamily,
  textColor = "#000000",
  backgroundColor = "#ffffff",
  textAlignment = "left",
  lineHeight = "1.5",
  isPreviewMode = false,
  onUpdateFormatting,
  onTogglePreview,
  onCopy
}) => {
  const handleUpdateFormat = (property: string, value: string) => {
    if (onUpdateFormatting) {
      onUpdateFormatting(property, value);
    }
  };

  const handleTextStyle = (command: string) => {
    document.execCommand(command, false);
  };

  const currentFont = fonts.find(font => font.value === fontFamily) || fonts[0];

  return (
    <div className="flex flex-wrap gap-1 items-center bg-white dark:bg-gray-800">
      {/* Font Family */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8">
            {currentFont.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fonts.map((font) => (
            <DropdownMenuItem 
              key={font.value}
              onClick={() => handleUpdateFormat('fontFamily', font.value)}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6" />

      {/* Text styles */}
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleTextStyle('bold')}>
        <Bold size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleTextStyle('italic')}>
        <Italic size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleTextStyle('underline')}>
        <Underline size={16} />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8">
            <Heading1 size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => document.execCommand('formatBlock', false, '<h1>')}>
            <Heading1 className="mr-2" size={16} /> Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => document.execCommand('formatBlock', false, '<h2>')}>
            <Heading2 className="mr-2" size={16} /> Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => document.execCommand('formatBlock', false, '<h3>')}>
            <Heading3 className="mr-2" size={16} /> Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => document.execCommand('formatBlock', false, '<p>')}>
            Normal Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alignment */}
      <Button 
        variant={textAlignment === 'left' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => handleUpdateFormat('textAlignment', 'left')}
      >
        <AlignLeft size={16} />
      </Button>
      <Button 
        variant={textAlignment === 'center' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => handleUpdateFormat('textAlignment', 'center')}
      >
        <AlignCenter size={16} />
      </Button>
      <Button 
        variant={textAlignment === 'right' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => handleUpdateFormat('textAlignment', 'right')}
      >
        <AlignRight size={16} />
      </Button>
      <Button 
        variant={textAlignment === 'justify' ? 'secondary' : 'ghost'} 
        size="sm" 
        className="h-8 w-8 p-0"
        onClick={() => handleUpdateFormat('textAlignment', 'justify')}
      >
        <AlignJustify size={16} />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => document.execCommand('insertUnorderedList')}
      >
        <List size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => document.execCommand('insertOrderedList')}
      >
        <ListOrdered size={16} />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0" 
        onClick={() => document.execCommand('insertHTML', false, '<div class="task-item"><input type="checkbox"> <span contenteditable="true">Task item</span></div>')}
      >
        <CheckSquare size={16} />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Colors */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: textColor }}></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Text Color</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="grid grid-cols-4 gap-1 p-1">
                {colors.map((color) => (
                  <div
                    key={color.value}
                    className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleUpdateFormat('textColor', color.value)}
                  />
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Background Color</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <div className="grid grid-cols-4 gap-1 p-1">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.value}
                    className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: bg.value }}
                    onClick={() => handleUpdateFormat('backgroundColor', bg.value)}
                  />
                ))}
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Line Height */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8">
            Line Height
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={lineHeight} onValueChange={(value) => handleUpdateFormat('lineHeight', value)}>
            {lineHeights.map((height) => (
              <DropdownMenuRadioItem key={height.value} value={height.value}>
                {height.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6" />

      {/* Insert elements */}
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Image size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Link size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => document.execCommand('formatBlock', false, '<pre>')}>
        <Code size={16} />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => document.execCommand('formatBlock', false, '<blockquote>')}>
        <Quote size={16} />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Actions */}
      {onCopy && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onCopy}>
          <Copy size={16} />
        </Button>
      )}
      
      {onTogglePreview && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={onTogglePreview}
        >
          {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      )}
    </div>
  );
};

export default FormatToolbar;
