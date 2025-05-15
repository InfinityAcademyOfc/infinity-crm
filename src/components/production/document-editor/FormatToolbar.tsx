
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { FontFamilyControls } from './toolbar/FontFamilyControls';
import { TextStyleControls } from './toolbar/TextStyleControls';
import { HeadingControls } from './toolbar/HeadingControls';
import { AlignmentControls } from './toolbar/AlignmentControls';
import { ListControls } from './toolbar/ListControls';
import { ColorControls } from './toolbar/ColorControls';
import { LineHeightControls } from './toolbar/LineHeightControls';
import { InsertControls } from './toolbar/InsertControls';
import { ActionControls } from './toolbar/ActionControls';

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

  const handleTextStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="flex flex-wrap gap-1 items-center bg-white dark:bg-gray-800">
      {/* Font Family */}
      <FontFamilyControls 
        fontFamily={fontFamily} 
        onUpdateFormatting={handleUpdateFormat} 
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Text styles */}
      <TextStyleControls onFormatAction={handleTextStyle} />

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <HeadingControls onFormatAction={handleTextStyle} />

      {/* Alignment */}
      <AlignmentControls 
        textAlignment={textAlignment} 
        onUpdateFormatting={handleUpdateFormat} 
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <ListControls onFormatAction={handleTextStyle} />

      <Separator orientation="vertical" className="h-6" />

      {/* Colors */}
      <ColorControls 
        textColor={textColor} 
        backgroundColor={backgroundColor} 
        onUpdateFormatting={handleUpdateFormat} 
      />

      {/* Line Height */}
      <LineHeightControls 
        lineHeight={lineHeight} 
        onUpdateFormatting={handleUpdateFormat} 
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Insert elements */}
      <InsertControls onFormatAction={handleTextStyle} />

      <Separator orientation="vertical" className="h-6" />

      {/* Actions */}
      <ActionControls 
        isPreviewMode={isPreviewMode} 
        onTogglePreview={onTogglePreview} 
        onCopy={onCopy} 
      />
    </div>
  );
};

export default FormatToolbar;
