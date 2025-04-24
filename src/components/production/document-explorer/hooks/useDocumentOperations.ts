
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useDocumentOperations = (onSelectFile: (file: DocumentItem | null) => void) => {
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { documents, setDocuments, selectedFolder, setSelectedFolder, setEditingItem } = useDocumentContext();

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
      const file = new Blob([item.content], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = `${item.name}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Documento exportado",
        description: `${item.name} foi exportado com sucesso.`
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

  return {
    newItemDialogOpen,
    setNewItemDialogOpen,
    handleAddItem,
    handleCreateItem,
    handleDeleteItem,
    handleRename,
    handleExportDocument,
    toggleFolderExpanded,
    updateFileContent
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
