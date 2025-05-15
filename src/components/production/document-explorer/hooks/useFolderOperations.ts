
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useFolderOperations = () => {
  const { documents, setDocuments, recentColors, setRecentColors } = useDocumentContext();
  const { toast } = useToast();

  // Função para alternar a expansão das pastas individualmente
  const toggleFolderExpanded = (folderId: string) => {
    const updatedDocs = toggleExpanded(documents, folderId);
    setDocuments(updatedDocs);
  };

  const addCustomColor = (color: string) => {
    // Validate color format before adding to prevent UI freeze
    try {
      // Use native window.CSS instead of the CSS from @dnd-kit/utilities
      if (color && window.CSS && window.CSS.supports('color', color) && !recentColors.includes(color)) {
        const newRecentColors = [color, ...recentColors].slice(0, 10);
        setRecentColors(newRecentColors);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Invalid color format:", error);
      return false;
    }
  };

  return {
    toggleFolderExpanded,
    addCustomColor
  };
};

// Helper function for toggling folder expanded state
const toggleExpanded = (items: DocumentItem[], itemId: string): DocumentItem[] => {
  return items.map(item => {
    if (item.id === itemId && item.type === "folder") {
      return {
        ...item,
        expanded: !item.expanded,
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
