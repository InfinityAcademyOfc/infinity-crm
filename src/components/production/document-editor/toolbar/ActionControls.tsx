
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';

interface ActionControlsProps {
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
  onCopy?: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  isPreviewMode,
  onTogglePreview,
  onCopy
}) => {
  return (
    <>
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
    </>
  );
};
