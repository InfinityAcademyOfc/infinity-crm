
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomColorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  onApplyColor: () => void;
}

export const CustomColorDialog: React.FC<CustomColorDialogProps> = ({
  isOpen,
  onClose,
  customColor,
  onCustomColorChange,
  onApplyColor,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Personalizar cor da pasta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              type="color"
              value={customColor}
              onChange={(e) => onCustomColorChange(e.target.value)}
              className="w-24 h-12"
            />
            <div className="text-sm">{customColor}</div>
          </div>
          <div className="h-20 rounded-md border" style={{ backgroundColor: customColor }}></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onApplyColor}>
            Aplicar cor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
