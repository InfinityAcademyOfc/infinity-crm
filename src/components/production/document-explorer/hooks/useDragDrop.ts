import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useDragDrop = () => {
  const { documents, setDocuments } = useDocumentContext();
  const { toast } = useToast();

  const handleDragEnd = (activeId: string, overId: string) => {
    if (activeId === overId) return;
    
    // Find the items being dragged and dropped on
    const findItem = (items: DocumentItem[], id: string): { item: DocumentItem | null, parent: DocumentItem | null, index: number } => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          return { item: items[i], parent: null, index: i };
        }
        
        if (items[i].children) {
          const result = findItem(items[i].children!, id);
          if (result.item) {
            return { ...result, parent: result.parent || items[i] };
          }
        }
      }
      return { item: null, parent: null, index: -1 };
    };
    
    const { item: draggedItem } = findItem(documents, activeId);
    const { item: dropTarget, parent: dropParent } = findItem(documents, overId);
    
    if (!draggedItem || !dropTarget) return;
    
    // Prevent dragging into the import folder
    if (dropTarget.id === "folder-imported" || dropParent?.id === "folder-imported") {
      toast({
        title: "Operação não permitida",
        description: "Não é possível mover itens para a pasta Importados",
        variant: "destructive"
      });
      return;
    }
    
    // Prevent dragging the import folder
    if (draggedItem.id === "folder-imported") {
      toast({
        title: "Operação não permitida",
        description: "A pasta Importados não pode ser movida",
        variant: "destructive"
      });
      return;
    }
    
    const updatedDocuments = moveItem(documents, draggedItem, dropTarget);
    
    if (updatedDocuments) {
      setDocuments(updatedDocuments);
      toast({
        title: "Item movido",
        description: `${draggedItem.name} foi movido com sucesso`
      });
    }
  };
  
  const moveItem = (
    items: DocumentItem[],
    draggedItem: DocumentItem,
    dropTarget: DocumentItem
  ): DocumentItem[] => {
    // Remove the dragged item from its current location
    const removeItem = (items: DocumentItem[], id: string): { newItems: DocumentItem[], removed?: DocumentItem } => {
      let removed: DocumentItem | undefined;
      
      const newItems = items.filter(item => {
        if (item.id === id) {
          removed = item;
          return false;
        }
        
        if (item.children && item.children.length > 0) {
          const result = removeItem(item.children, id);
          if (result.removed) {
            removed = result.removed;
            item.children = result.newItems;
          }
        }
        
        return true;
      });
      
      return { newItems, removed };
    };
    
    // Add the dragged item to its new location
    const addItem = (items: DocumentItem[], targetId: string, itemToAdd: DocumentItem): DocumentItem[] => {
      return items.map(item => {
        if (item.id === targetId) {
          // If dropping onto a folder, add to its children
          if (item.type === "folder") {
            return {
              ...item,
              expanded: true, // Auto-expand the folder
              children: [...(item.children || []), itemToAdd]
            };
          }
          
          // If dropping onto a non-folder item in the root, add after it
          if (!item.children) {
            return item;
          }
        }
        
        if (item.children) {
          return {
            ...item,
            children: addItem(item.children, targetId, itemToAdd)
          };
        }
        
        return item;
      });
    };
    
    // Remove the item from its current location
    const { newItems, removed } = removeItem(items, draggedItem.id);
    
    if (!removed) return items;
    
    // If dropping onto a folder, add it to the folder's children
    if (dropTarget.type === "folder") {
      return addItem(newItems, dropTarget.id, removed);
    }
    
    // Otherwise, add it at the root level after the drop target
    const parentId = getParentId(items, dropTarget.id);
    
    if (parentId) {
      // Add it to the same parent after the drop target
      const parent = findById(newItems, parentId);
      
      if (parent && parent.children) {
        const targetIndex = parent.children.findIndex(item => item.id === dropTarget.id);
        
        if (targetIndex !== -1) {
          parent.children.splice(targetIndex + 1, 0, removed);
        }
      }
      
      return [...newItems];
    } else {
      // Add it at the root level after the drop target
      const targetIndex = newItems.findIndex(item => item.id === dropTarget.id);
      
      if (targetIndex !== -1) {
        newItems.splice(targetIndex + 1, 0, removed);
      }
      
      return newItems;
    }
  };
  
  const getParentId = (items: DocumentItem[], id: string): string | null => {
    for (const item of items) {
      if (item.children && item.children.some(child => child.id === id)) {
        return item.id;
      }
      
      if (item.children) {
        const parentId = getParentId(item.children, id);
        if (parentId) return parentId;
      }
    }
    
    return null;
  };
  
  const findById = (items: DocumentItem[], id: string): DocumentItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      
      if (item.children) {
        const found = findById(item.children, id);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  return { handleDragEnd, moveItem };
};
