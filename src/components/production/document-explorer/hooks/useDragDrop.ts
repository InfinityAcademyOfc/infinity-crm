
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useDragDrop = () => {
  const { documents, setDocuments } = useDocumentContext();
  const { toast } = useToast();

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
    
    if (over?.type === "file") {
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
      moveItem(activeId, overId);
    }
  };

  const moveItem = (itemId: string, targetFolderId: string) => {
    let itemToMove: DocumentItem | null = null;
    
    const removeItemFromSource = (items: DocumentItem[]): DocumentItem[] => {
      return items.filter(item => {
        if (item.id === itemId) {
          itemToMove = { ...item };
          return false;
        }
        
        if (item.children) {
          item.children = removeItemFromSource(item.children);
        }
        
        return true;
      });
    };
    
    let newDocs = removeItemFromSource([...documents]);
    
    if (itemToMove) {
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
    handleDragEnd,
    moveItem
  };
};
