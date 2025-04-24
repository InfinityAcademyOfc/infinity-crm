
import React, { useState } from 'react';
import { File, Folder, FolderOpen, MoreHorizontal, Pencil, Download, Trash, ChevronRight, ChevronDown } from 'lucide-react';
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

// Paleta de cores suaves + cores mais fortes
const pastelColors = [
  "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF", "#FFDEE2",
  "#FDE1D3", "#D3E4FD", "#F1F0FB"
];
const strongColors = [
  "#6E59A5", "#F97316", "#0EA5E9", "#8B5CF6", "#D946EF", "#ea384c", "#1A1F2C", "#403E43", "#1EAEDB", "#38bdf8"
];
const folderColors = [...pastelColors, ...strongColors];

interface DocumentTreeItemProps {
  item: DocumentItem;
  onSelect: (file: DocumentItem) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (item: DocumentItem) => void;
  onToggleExpanded: (id: string) => void;
  selectedFile: DocumentItem | null;
}

const DocumentTreeItem: React.FC<DocumentTreeItemProps> = ({
  item,
  onSelect,
  onDelete,
  onRename,
  onExport,
  onToggleExpanded,
  selectedFile,
}) => {
  const { selectedFolder, setSelectedFolder, editingItem, setEditingItem } = useDocumentContext();
  const [folderColor, setFolderColor] = useState(
    (item as any).folderColor || folderColors[0]
  );
  const isSelected = selectedFile?.id === item.id || selectedFolder === item.id;
  const isFolder = item.type === "folder";
  const isExpanded = isFolder && item.expanded;

  const handleFolderClick = () => setSelectedFolder(selectedFolder === item.id ? null : item.id);

  const startRenaming = () => setEditingItem({ id: item.id, name: item.name });
  const handleColorChange = (color: string) => {
    setFolderColor(color);
    (item as any).folderColor = color;
  };

  if (editingItem?.id === item.id) {
    return (
      <TreeItem
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
    <TreeItem
      defaultOpen={isFolder ? item.expanded : undefined}
      icon={
        <div className="flex items-center">
          {isFolder && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 mr-1"
              onClick={e => { e.stopPropagation(); onToggleExpanded(item.id); }}
              title="Expandir/recolher pasta"
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
        // Sempre visível para pastas/arquivos: três pontos (menu)
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="flex items-center"><span style={{ fontSize: 18, marginRight: 6 }}>🎨</span>Cores</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-2 grid grid-cols-5 gap-1 bg-white dark:bg-gray-900 rounded shadow z-50">
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
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
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
        />
      ))}
    </TreeItem>
  );
};

export default DocumentTreeItem;

// AVISO: Esse arquivo está ficando muito longo, considere pedir para refatorar.
