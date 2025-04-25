import React, { useState } from 'react';
import { File, Folder, FolderOpen, MoreHorizontal, Pencil, Download, Trash, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import { TreeItem } from '@/components/ui/tree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS as DndKitCSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Enhanced color palette with more variety
const folderColors = [
  // Pastel colors
  "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2",
  "#FDE1D3", "#D3E4FD", "#F1F0FB",
  // Strong colors
  "#6E59A5", "#F97316", "#0EA5E9", "#8B5CF6", "#D946EF", 
  "#ea384c", "#1A1F2C", "#403E43", "#1EAEDB", "#38bdf8",
  // Vibrant colors
  "#10B981", "#22C55E", "#EAB308", "#EC4899", "#06B6D4"
];

interface DocumentTreeItemProps {
  item: DocumentItem;
  onSelect: (file: DocumentItem) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (item: DocumentItem) => void;
  onToggleExpanded: (id: string) => void;
  selectedFile: DocumentItem | null;
  isImportFolder?: boolean;
}

const DocumentTreeItem: React.FC<DocumentTreeItemProps> = ({
  item,
  onSelect,
  onDelete,
  onRename,
  onExport,
  onToggleExpanded,
  selectedFile,
  isImportFolder = false,
}) => {
  const { selectedFolder, setSelectedFolder, editingItem, setEditingItem, recentColors, setRecentColors } = useDocumentContext();
  const [folderColor, setFolderColor] = useState((item as any).folderColor || folderColors[0]);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const isSelected = selectedFile?.id === item.id || selectedFolder === item.id;
  const isFolder = item.type === "folder";
  const isExpanded = isFolder && item.expanded;

  // DnD Kit integration - disable for import folder
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'document-item',
      item,
    },
    disabled: isImportFolder
  });

  const style = {
    transform: DndKitCSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto' as any,
  };

  const handleFolderClick = () => {
    if (isFolder) {
      onToggleExpanded(item.id);
    }
    setSelectedFolder(selectedFolder === item.id ? null : item.id);
  };

  const startRenaming = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem({ id: item.id, name: item.name });
  };

  const handleColorChange = (color: string) => {
    try {
      // Use window.CSS instead of the CSS from @dnd-kit/utilities
      if (window.CSS && window.CSS.supports('color', color)) {
        setFolderColor(color);
        (item as any).folderColor = color;
        
        // Update recent colors if it's a custom color not in the predefined list
        if (!folderColors.includes(color)) {
          const updatedRecentColors = [color, ...recentColors.filter(c => c !== color)].slice(0, 10);
          setRecentColors(updatedRecentColors);
        }
      } else {
        console.warn("Invalid color format:", color);
      }
    } catch (error) {
      console.error("Error setting folder color:", error);
    }
  };

  const handleApplyCustomColor = () => {
    try {
      // Use window.CSS instead of the CSS from @dnd-kit/utilities
      if (window.CSS && window.CSS.supports('color', customColor)) {
        handleColorChange(customColor);
        setIsColorDialogOpen(false);
      } else {
        console.warn("Invalid custom color format:", customColor);
      }
    } catch (error) {
      console.error("Error applying custom color:", error);
    }
  };

  if (editingItem?.id === item.id) {
    return (
      <TreeItem
        ref={setNodeRef}
        style={style}
        icon={isFolder ?
          <div className="relative"><div className="h-4 w-6 rounded-[0.25rem] mr-1 border" style={{ background: folderColor }}></div></div>
          : <File className="h-4 w-4" />}
        label={
          <Input
            size={1}
            className="h-6 py-1 text-xs"
            defaultValue={editingItem.name}
            autoFocus
            onBlur={(e) => onRename(item.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onRename(item.id, e.currentTarget.value);
              else if (e.key === 'Escape') setEditingItem(null);
            }}
          />
        }
      />
    );
  }

  return (
    <>
      <TreeItem
        ref={setNodeRef}
        style={style}
        defaultOpen={isFolder ? item.expanded : undefined}
        icon={
          <div className="flex items-center">
            {!isImportFolder && (
              <div 
                {...listeners}
                {...attributes}
                className="cursor-grab hover:bg-muted/30 rounded mr-1"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            {isFolder && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 mr-1"
                onClick={(e) => { e.stopPropagation(); onToggleExpanded(item.id); }}
                title={isExpanded ? "Recolher pasta" : "Expandir pasta"}
                tabIndex={-1}
              >
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            )}
            <span className={cn("h-4 w-4", isSelected && "text-primary")}>
              {isFolder ? (
                <div className="relative group">
                  <div
                    className="h-4 w-6 rounded-[0.25rem] border border-gray-300 group-hover:brightness-95 cursor-pointer mr-1"
                    style={{ background: folderColor, transition: "background 0.3s" }}
                    title="Cor da pasta"
                  ></div>
                </div>
              ) : (
                <File />
              )}
            </span>
          </div>
        }
        label={item.name}
        onClick={isFolder ? handleFolderClick : () => onSelect(item)}
        className={cn(isSelected && "bg-primary/10 group")}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-70 hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 z-50">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={startRenaming}>
                  <Pencil className="mr-2 h-4 w-4" /> Renomear
                </DropdownMenuItem>
                {item.type === "file" && (
                  <DropdownMenuItem onClick={() => onExport(item)}>
                    <Download className="mr-2 h-4 w-4" /> Exportar
                  </DropdownMenuItem>
                )}
                {isFolder && !isImportFolder && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span className="flex items-center"><span style={{ fontSize: 18, marginRight: 6 }}>🎨</span>Cores</span>
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
                            onClick={() => handleColorChange(color)}
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
                              onClick={() => handleColorChange(color)}
                              aria-label={`Cor ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => setIsColorDialogOpen(true)}>
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
                    <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive">
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {isFolder && item.children && item.expanded && item.children.map(child => (
          <DocumentTreeItem
            key={child.id}
            item={child}
            onSelect={onSelect}
            onDelete={onDelete}
            onRename={onRename}
            onExport={onExport}
            onToggleExpanded={onToggleExpanded}
            selectedFile={selectedFile}
            isImportFolder={isImportFolder}
          />
        ))}
      </TreeItem>

      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
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
            <div className="h-20 rounded-md border" style={{ backgroundColor: customColor }}></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>
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
};

export default DocumentTreeItem;
