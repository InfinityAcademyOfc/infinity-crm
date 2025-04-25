
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from '../types';
import { useDocumentContext } from '../contexts/DocumentContext';

export const useFileOperations = (onSelectFile: (file: DocumentItem | null) => void) => {
  const { documents, setDocuments } = useDocumentContext();
  const { toast } = useToast();

  const updateFileContent = (fileId: string, content: string) => {
    const updatedDocs = updateContent(documents, fileId, content);
    setDocuments(updatedDocs);
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

  return {
    updateFileContent,
    handleExportDocument
  };
};
