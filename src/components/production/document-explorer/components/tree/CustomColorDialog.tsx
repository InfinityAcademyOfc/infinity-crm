
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  const [tempColor, setTempColor] = useState(customColor);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value);
    onCustomColorChange(e.target.value);
  };

  const handleSafeApply = () => {
    try {
      // Validate color before applying
      if (window.CSS && window.CSS.supports('color', tempColor)) {
        onApplyColor();
        toast.success('Cor personalizada aplicada com sucesso');
      } else {
        toast.error('Formato de cor inválido');
      }
    } catch (error) {
      console.error("Error applying color:", error);
      toast.error('Erro ao aplicar cor personalizada');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
      else setTempColor(customColor); // Reset to initial value when opening
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Personalizar cor da pasta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              type="color"
              value={tempColor}
              onChange={handleColorChange}
              className="w-24 h-12"
            />
            <div className="text-sm">{tempColor}</div>
          </div>
          <div className="h-20 rounded-md border" style={{ backgroundColor: tempColor }}></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSafeApply}>
            Aplicar cor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
