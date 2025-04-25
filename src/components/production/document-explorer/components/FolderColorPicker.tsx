
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface FolderColorPickerProps {
  folderColors: string[];
  recentColors: string[];
  onColorChange: (color: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FolderColorPicker({
  folderColors,
  recentColors,
  onColorChange,
  isOpen,
  onOpenChange
}: FolderColorPickerProps) {
  const [customColor, setCustomColor] = useState("#FFFFFF");

  const handleApplyCustomColor = () => {
    onColorChange(customColor);
    onOpenChange(false);
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-1 mb-2">
        {folderColors.map(color => (
          <Button
            key={color}
            variant="ghost"
            size="icon"
            className="w-5 h-5 border"
            style={{ background: color }}
            onClick={() => onColorChange(color)}
            aria-label={`Cor ${color}`}
          />
        ))}
      </div>
      
      <DropdownMenuSeparator />
      
      <div className="pt-2">
        <p className="text-xs text-muted-foreground mb-1 px-2">Cores recentes</p>
        <div className="grid grid-cols-5 gap-1">
          {recentColors.slice(0, 5).map(color => (
            <Button
              key={color}
              variant="ghost"
              size="icon"
              className="w-5 h-5 border"
              style={{ background: color }}
              onClick={() => onColorChange(color)}
              aria-label={`Cor ${color}`}
            />
          ))}
        </div>
      </div>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem onClick={() => onOpenChange(true)}>
        <span className="flex items-center gap-2">
          <span style={{ fontSize: 16 }}>➕</span> Personalizar cor
        </span>
      </DropdownMenuItem>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personalizar cor da pasta</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-24 h-12"
              />
              <div className="text-sm">{customColor}</div>
            </div>
            <div className="h-20 rounded-md border" style={{ backgroundColor: customColor }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyCustomColor}>
              Aplicar cor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
