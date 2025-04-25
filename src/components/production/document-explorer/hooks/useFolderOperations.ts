
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useFolderOperations = () => {
  const { documents, setDocuments, recentColors, setRecentColors } = useDocumentContext();
  const { toast } = useToast();

  const toggleFolderExpanded = (folderId: string) => {
    const updatedDocs = toggleExpanded(documents, folderId);
    setDocuments(updatedDocs);
  };

  const addCustomColor = (color: string) => {
    if (!recentColors.includes(color)) {
      const newRecentColors = [color, ...recentColors].slice(0, 10);
      setRecentColors(newRecentColors);
    }
  };

  return {
    toggleFolderExpanded,
    addCustomColor
  };
};
