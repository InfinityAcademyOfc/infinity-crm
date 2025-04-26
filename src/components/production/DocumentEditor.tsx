
import React, { useState, useEffect } from "react";
import DocumentExplorer from "./document-explorer/DocumentExplorer";
import { DocumentItem } from "./document-explorer/types";
import DocumentContent from "./document-editor/DocumentContent";
import { useToast } from "@/hooks/use-toast";
import { useDocumentContext } from "./document-explorer/contexts/DocumentContext";
import { useDocumentOperations } from "./document-explorer/hooks/useDocumentOperations";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DocumentEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
      <div className="flex h-full relative">
        {/* Toggle button that's always visible */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 rounded-full bg-card shadow-md dark:bg-gray-800/50 backdrop-blur-sm",
              "border border-border/40 -ml-4 transition-all",
              "hover:bg-accent dark:hover:bg-gray-700/70",
              "dark:shadow-[0_0_5px_rgba(125,90,250,0.3)]",
              "dark:hover:shadow-[0_0_8px_rgba(125,90,250,0.5)]"
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 dark:text-purple-200" />
            ) : (
              <ChevronLeft className="h-4 w-4 dark:text-purple-200" />
            )}
          </Button>
        </div>
        
        {/* Sidebar with animation */}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full border-r dark:border-gray-800 overflow-hidden bg-card/90 dark:bg-gray-800/50 backdrop-blur-md"
            >
              <DocumentExplorer onSelectFile={handleSelectFile} selectedFile={selectedFile} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content area */}
        <div className={cn("flex-grow transition-all duration-300", sidebarCollapsed ? "pl-5" : "")}>
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
