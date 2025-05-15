
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';
import { useFileOperations } from './useFileOperations';
import { useFolderOperations } from './useFolderOperations';
import { useDragDrop } from './useDragDrop';

export const useDocumentOperations = (onSelectFile: (file: DocumentItem | null) => void) => {
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  const { documents, setDocuments, selectedFolder, setSelectedFolder, setEditingItem } = useDocumentContext();
  const { toast } = useToast();
  
  const { updateFileContent, handleExportDocument } = useFileOperations(onSelectFile);
  const { toggleFolderExpanded, addCustomColor } = useFolderOperations();
  const { handleDragEnd, moveItem } = useDragDrop();

  const handleAddItem = (parentId: string | null) => {
    setNewItemParentId(parentId);
    setNewItemDialogOpen(true);
  };

  const handleCreateItem = (name: string, type: "file" | "folder") => {
    const newItem: DocumentItem = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      content: type === "file" ? "" : undefined,
      expanded: type === "folder" ? true : undefined,
      children: type === "folder" ? [] : undefined,
    };
    
    const effectiveParentId = newItemParentId === null && selectedFolder ? selectedFolder : newItemParentId;
    
    if (effectiveParentId === null) {
      setDocuments([...documents, newItem]);
    } else {
      const updatedDocs = addItemToFolder(documents, effectiveParentId, newItem);
      setDocuments(updatedDocs);
    }
    
    if (type === "file") {
      onSelectFile(newItem);
    }
    
    toast({
      title: `${type === "file" ? "Documento" : "Pasta"} criado(a)`,
      description: `${name} foi criado(a) com sucesso.`
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedDocs = deleteItem(documents, itemId);
    setDocuments(updatedDocs);
    
    if (selectedFolder === itemId) {
      setSelectedFolder(null);
    }
    
    onSelectFile(null);
    
    toast({
      title: "Item excluído",
      description: "O item foi excluído com sucesso."
    });
  };

  const handleRename = (itemId: string, newName: string) => {
    if (!newName.trim()) {
      setEditingItem(null);
      return;
    }
    
    const updatedDocs = renameItem(documents, itemId, newName);
    setDocuments(updatedDocs);
    setEditingItem(null);
    
    toast({
      title: "Item renomeado",
      description: `Nome alterado para '${newName}'.`
    });
  };

  return {
    newItemDialogOpen,
    setNewItemDialogOpen,
    handleAddItem,
    handleCreateItem,
    handleDeleteItem,
    handleRename,
    handleExportDocument,
    toggleFolderExpanded,
    updateFileContent,
    addCustomColor,
    handleDragEnd,
    moveItem
  };
};

// Helper functions
const addItemToFolder = (items: DocumentItem[], folderId: string, newItem: DocumentItem): DocumentItem[] => {
  return items.map(item => {
    if (item.id === folderId && item.type === "folder") {
      return {
        ...item,
        children: [...(item.children || []), newItem],
      };
    } else if (item.children) {
      return {
        ...item,
        children: addItemToFolder(item.children, folderId, newItem),
      };
    }
    return item;
  });
};

const deleteItem = (items: DocumentItem[], itemId: string): DocumentItem[] => {
  return items.filter(item => {
    if (item.id === itemId) {
      return false;
    }
    
    if (item.children) {
      item.children = deleteItem(item.children, itemId);
    }
    
    return true;
  });
};

const renameItem = (items: DocumentItem[], itemId: string, newName: string): DocumentItem[] => {
  return items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        name: newName,
      };
    }
    
    if (item.children) {
      return {
        ...item,
        children: renameItem(item.children, itemId, newName),
      };
    }
    
    return item;
  });
};
