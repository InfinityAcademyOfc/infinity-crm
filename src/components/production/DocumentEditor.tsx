
import React, { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DocumentExplorer from "./document-explorer/DocumentExplorer";
import { DocumentItem } from "./document-explorer/types";
import DocumentContent from "./document-editor/DocumentContent";
import { useToast } from "@/hooks/use-toast";
import { useDocumentContext } from "./document-explorer/contexts/DocumentContext";
import { useDocumentOperations } from "./document-explorer/hooks/useDocumentOperations";

const DocumentEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const { toast } = useToast();
  const { documents } = useDocumentContext();
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

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      saveCurrentFile();
    };
  }, [selectedFile]);
  
  return (
    <div className="h-full border rounded-lg overflow-hidden" style={{ height: '842px' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <DocumentExplorer onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel>
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
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DocumentEditor;
