
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useDocumentOperations = (onSelectFile: (file: DocumentItem | null) => void) => {
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { documents, setDocuments, selectedFolder, setSelectedFolder, setEditingItem, recentColors, setRecentColors } = useDocumentContext();

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

  const handleExportDocument = (item: DocumentItem) => {
    if (item.type === "file" && item.content) {
      const element = document.createElement("a");
      const file = new Blob([item.content], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      element.href = URL.createObjectURL(file);
      element.download = `${item.name}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Documento exportado",
        description: `${item.name} foi exportado com sucesso como documento DOCX.`
      });
    }
  };

  const toggleFolderExpanded = (folderId: string) => {
    const updatedDocs = toggleExpanded(documents, folderId);
    setDocuments(updatedDocs);
  };

  const updateFileContent = (fileId: string, content: string) => {
    const updatedDocs = updateContent(documents, fileId, content);
    setDocuments(updatedDocs);
  };

  const addCustomColor = (color: string) => {
    // Add new color to recent colors if it doesn't already exist
    if (!recentColors.includes(color)) {
      const newRecentColors = [color, ...recentColors].slice(0, 10); // Keep only the 10 most recent colors
      setRecentColors(newRecentColors);
    }
  };

  // Handle drag and drop functionality
  const handleDragEnd = (activeId: string, overId: string) => {
    if (activeId === overId) return;
    
    const findItem = (items: DocumentItem[], id: string): DocumentItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findItem(item.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const active = findItem(documents, activeId);
    const over = findItem(documents, overId);
    
    if (!active) return;
    
    // If trying to drop onto a file or outside valid targets
    if (over?.type === "file") {
      // Try to find the parent folder of the target file
      const findParentFolder = (items: DocumentItem[], childId: string, parent: string | null = null): string | null => {
        for (const item of items) {
          if (item.children?.some(child => child.id === childId)) return item.id;
          if (item.children) {
            const found = findParentFolder(item.children, childId, item.id);
            if (found) return found;
          }
        }
        return parent;
      };
      
      const targetFolderId = findParentFolder(documents, overId);
      if (targetFolderId) {
        moveItem(activeId, targetFolderId);
      }
    } else if (over?.type === "folder") {
      // If dropping onto a folder, add it as a child of that folder
      moveItem(activeId, overId);
    }
  };
  
  const moveItem = (itemId: string, targetFolderId: string) => {
    // First find and remove the item from its current location
    let itemToMove: DocumentItem | null = null;
    
    const removeItemFromSource = (items: DocumentItem[]): DocumentItem[] => {
      const result = items.filter(item => {
        if (item.id === itemId) {
          itemToMove = { ...item };
          return false;
        }
        
        if (item.children) {
          item.children = removeItemFromSource(item.children);
        }
        
        return true;
      });
      
      return result;
    };
    
    let newDocs = removeItemFromSource([...documents]);
    
    // Then add the item to its new location
    if (itemToMove) {
      // If target is root level
      if (targetFolderId === 'root') {
        newDocs = [...newDocs, itemToMove];
      } else {
        newDocs = addItemToFolder(newDocs, targetFolderId, itemToMove);
      }
      
      setDocuments(newDocs);
      
      toast({
        title: "Item movido",
        description: `${itemToMove.name} foi movido com sucesso.`
      });
    }
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

const toggleExpanded = (items: DocumentItem[], itemId: string): DocumentItem[] => {
  return items.map(item => {
    if (item.id === itemId && item.type === "folder") {
      return {
        ...item,
        expanded: !(item.expanded),
      };
    }
    
    if (item.children) {
      return {
        ...item,
        children: toggleExpanded(item.children, itemId),
      };
    }
    
    return item;
  });
};

const updateContent = (items: DocumentItem[], itemId: string, content: string): DocumentItem[] => {
  return items.map(item => {
    if (item.id === itemId) {
      return {
        ...item,
        content,
      };
    }
    
    if (item.children) {
      return {
        ...item,
        children: updateContent(item.children, itemId, content),
      };
    }
    
    return item;
  });
};
