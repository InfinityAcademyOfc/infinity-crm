
import React, { useState } from 'react';
import { TreeItem } from '@/components/ui/tree';
import { Input } from '@/components/ui/input';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS as DndKitCSS } from '@dnd-kit/utilities';
import { TreeItemIcon } from './tree/TreeItemIcon';
import { TreeItemActions } from './tree/TreeItemActions';
import { CustomColorDialog } from './tree/CustomColorDialog';
import { File } from 'lucide-react';

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
  const { selectedFolder, setSelectedFolder, editingItem, setEditingItem, recentColors, setRecentColors, documents, setDocuments } = useDocumentContext();
  const [folderColor, setFolderColor] = useState(item.folderColor || folderColors[0]);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const isSelected = selectedFile?.id === item.id || selectedFolder === item.id;
  const isFolder = item.type === "folder";
  const isExpanded = isFolder && item.expanded;

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
    setSelectedFolder(item.id === selectedFolder ? null : item.id);
  };

  const handleToggleExpand = () => {
    if (isFolder) {
      onToggleExpanded(item.id);
    }
  };

  const startRenaming = () => {
    setEditingItem({ id: item.id, name: item.name });
  };

  const handleColorChange = (color: string) => {
    try {
      if (window.CSS && window.CSS.supports('color', color)) {
        setFolderColor(color);
      
        const updateFolderColor = (doc: DocumentItem, id: string, color: string): DocumentItem => {
          if (doc.id === id) {
            return { ...doc, folderColor: color };
          }
          if (doc.children) {
            return { ...doc, children: doc.children.map(child => updateFolderColor(child, id, color)) };
          }
          return doc;
        };
        
        const updatedDocuments = documents.map(doc => updateFolderColor(doc, item.id, color));
        setDocuments(updatedDocuments);

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
          <TreeItemIcon
            item={item}
            isFolder={isFolder}
            isExpanded={isExpanded}
            isImportFolder={isImportFolder}
            folderColor={folderColor}
            onToggleExpanded={handleToggleExpand}
            dragHandleProps={{ ...listeners, ...attributes }}
          />
        }
        label={item.name}
        onClick={isFolder ? handleFolderClick : () => onSelect(item)}
        className={cn(isSelected && "bg-primary/10 group")}
        actions={
          <TreeItemActions
            item={item}
            isImportFolder={isImportFolder}
            isFolder={isFolder}
            onRename={startRenaming}
            onExport={() => onExport(item)}
            onDelete={() => onDelete(item.id)}
            onColorDialogOpen={() => setIsColorDialogOpen(true)}
            recentColors={recentColors}
            folderColors={folderColors}
            onColorChange={handleColorChange}
          />
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

      <CustomColorDialog
        isOpen={isColorDialogOpen}
        onClose={() => setIsColorDialogOpen(false)}
        customColor={customColor}
        onCustomColorChange={setCustomColor}
        onApplyColor={handleApplyCustomColor}
      />
    </>
  );
};

export default DocumentTreeItem;
