
import React from 'react';
import { MoreHorizontal, Pencil, Download, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentItem } from '../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

interface TreeItemActionsProps {
  item: DocumentItem;
  isImportFolder: boolean;
  isFolder: boolean;
  onRename: () => void;
  onExport: () => void;
  onDelete: () => void;
  onColorDialogOpen: () => void;
  recentColors: string[];
  folderColors: string[];
  onColorChange: (color: string) => void;
}

export const TreeItemActions: React.FC<TreeItemActionsProps> = ({
  item,
  isImportFolder,
  isFolder,
  onRename,
  onExport,
  onDelete,
  onColorDialogOpen,
  recentColors,
  folderColors,
  onColorChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 z-50">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onRename}>
            <Pencil className="mr-2 h-4 w-4" /> Renomear
          </DropdownMenuItem>
          {item.type === "file" && (
            <DropdownMenuItem onClick={onExport}>
              <Download className="mr-2 h-4 w-4" /> Exportar
            </DropdownMenuItem>
          )}
          {isFolder && !isImportFolder && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex items-center">
                  <span style={{ fontSize: 18, marginRight: 6 }}>🎨</span>Cores
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-2">
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
                
                <DropdownMenuItem onClick={onColorDialogOpen}>
                  <span className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>➕</span> Personalizar cor
                  </span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          {!isImportFolder && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
