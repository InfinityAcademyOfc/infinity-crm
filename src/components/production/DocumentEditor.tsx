import React, { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DocumentExplorer from "./document-explorer/DocumentExplorer";
import { DocumentItem } from "./document-explorer/types";
import DocumentContent from "./document-editor/DocumentContent";
import { useToast } from "@/hooks/use-toast";
import { useDocumentContext } from "./document-explorer/contexts/DocumentContext";
import { useDocumentOperations } from "./document-explorer/hooks/useDocumentOperations";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const DocumentEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const { toast } = useToast();
  const { documents, setDocuments } = useDocumentContext();
  const { updateFileContent } = useDocumentOperations(() => {});
  
  const handleSelectFile = (file: DocumentItem) => {
    if (selectedFile) {
      // Auto-save current file before switching
      saveCurrentFile();
    }

    if (file.type === "file") {
      setSelectedFile(file);
      toast({
        title: "Documento aberto",
        description: `${file.name} foi aberto com sucesso.`
      });
    }
  };
  
  const handleContentChange = (content: string) => {
    if (selectedFile) {
      updateFileContent(selectedFile.id, content);
    }
  };

  const saveCurrentFile = () => {
    if (selectedFile?.content) {
      updateFileContent(selectedFile.id, selectedFile.content);
    }
  };

  // Handle file drop for import
  useEffect(() => {
    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();
      
      if (!event.dataTransfer?.files.length) return;
      
      const files = Array.from(event.dataTransfer.files).filter(
        file => file.type.includes('document') || file.type.includes('text')
      );
      
      if (files.length === 0) {
        toast({
          title: "Formato não suportado",
          description: "Apenas documentos de texto são suportados",
          variant: "destructive"
        });
        return;
      }
      
      // Find the imports folder or create it if it doesn't exist
      let importFolder = documents.find(doc => doc.id === "folder-imported");
      
      if (!importFolder) {
        importFolder = {
          id: "folder-imported",
          name: "Importados",
          type: "folder",
          expanded: true,
          children: []
        };
        setDocuments([...documents, importFolder]);
      }
      
      // Process each file
      for (const file of files) {
        try {
          const content = await file.text();
          const name = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          
          const newDoc: DocumentItem = {
            id: `file-import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            type: "file",
            content
          };
          
          const updatedDocs = documents.map(doc => {
            if (doc.id === "folder-imported") {
              return {
                ...doc,
                expanded: true,
                children: [...(doc.children || []), newDoc]
              };
            }
            return doc;
          });
          
          setDocuments(updatedDocs);
          
          toast({
            title: "Documento importado",
            description: `${name} foi importado com sucesso para a pasta Importados.`
          });
        } catch (error) {
          toast({
            title: "Erro ao importar",
            description: `Falha ao importar ${file.name}.`,
            variant: "destructive"
          });
        }
      }
    };
    
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };
    
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragover', handleDragOver);
    
    return () => {
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragover', handleDragOver);
    };
  }, [documents, setDocuments, toast]);
  
  // Auto-save on unmount
  useEffect(() => {
    return () => {
      saveCurrentFile();
    };
  }, [selectedFile]);
  
  return (
    <div className="h-full border rounded-lg overflow-hidden dark:border-gray-800 dark:neon-floor" style={{ height: '842px' }}>
      <div className="flex h-full">
        <div className="h-full">
          <DocumentExplorer onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </div>
        
        <div className="flex-grow">
          {selectedFile ? (
            <DocumentContent 
              initialContent={selectedFile.content || ""}
              onContentChange={handleContentChange}
              documentId={selectedFile.id}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p>Selecione um documento para editar</p>
                <p className="text-sm">ou crie um novo na barra lateral</p>
                <p className="text-xs mt-4 text-muted-foreground">
                  Você também pode arrastar e soltar arquivos para importá-los
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
