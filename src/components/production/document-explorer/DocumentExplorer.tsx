
import React, { useState, useEffect } from "react";
import { Tree } from "@/components/ui/tree";
import { DocumentProvider } from "./contexts/DocumentContext";
import { useDocumentContext } from "./contexts/DocumentContext";
import { useDocumentOperations } from "./hooks/useDocumentOperations";
import ExplorerHeader from "@/components/common/explorer/ExplorerHeader";
import DocumentTreeItem from "./components/DocumentTreeItem";
import NewItemDialog from "./NewItemDialog";
import { DocumentItem } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DndProvider } from "@/components/ui/dnd-provider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialDocuments: DocumentItem[] = [
  {
    id: "folder-1",
    name: "Projetos",
    type: "folder",
    expanded: true,
    children: [{
      id: "file-1",
      name: "Pipeline de Prospecção BDR/SDR - Infinity",
      type: "file",
      content: "# Pipeline de Prospecção BDR/SDR - Infinity\n\n## Dicas:\n\n\"Estudar é uma forma de estar no controle do seu destino.\"\n\nSe você focar no seu objetivo atual, seja um curso, um livro, estudar para empreender, ou seguir uma carreira, então estude e busque ao máximo para conquistar seus objetivos.\n\nEsse material é exclusivo da Infinity B2B - Especializada em Soluções e Resultados - com intuito de te dar a força e o apoio para alcançar seus resultados, e também será muito útil para sua carreira profissional, com essa experiência e aprendizados vamos crescer juntos e ajudar na realização de novos conquistas!"
    }, {
      id: "file-2",
      name: "Projeto A",
      type: "file",
      content: "# Projeto A\n\nDescrição do projeto A e seus objetivos principais."
    }]
  }, {
    id: "folder-2",
    name: "Documentos",
    type: "folder",
    expanded: false,
    children: [{
      id: "file-3",
      name: "Contrato",
      type: "file",
      content: "# Modelo de Contrato\n\nTermos e condições para novos clientes."
    }]
  }, {
    id: "folder-3",
    name: "Processos",
    type: "folder",
    expanded: false,
    children: [{
      id: "file-4",
      name: "Onboarding",
      type: "file",
      content: "# Processo de Onboarding\n\n1. Reunião inicial\n2. Levantamento de requisitos\n3. Definição de escopo"
    }]
  }, {
    id: "folder-imported",
    name: "Importados",
    type: "folder",
    expanded: false,
    children: []
  }
];

interface DocumentExplorerProps {
  onSelectFile: (file: DocumentItem) => void;
  selectedFile: DocumentItem | null;
}

const DocumentExplorerContent: React.FC<DocumentExplorerProps> = ({
  onSelectFile,
  selectedFile
}) => {
  const {
    documents,
    searchQuery,
  } = useDocumentContext();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    newItemDialogOpen,
    setNewItemDialogOpen,
    handleAddItem,
    handleCreateItem,
    handleDeleteItem,
    handleRename,
    handleExportDocument,
    toggleFolderExpanded,
    handleDragEnd
  } = useDocumentOperations(onSelectFile);
  
  const renderItems = (items: DocumentItem[]) => {
    if (!items || items.length === 0) return null;
    
    const filteredItems = searchQuery 
      ? items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (item.children && item.children.some(child => 
            child.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
        ) 
      : items;
    
    // Position "Importados" folder first in the list
    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a.id === "folder-imported") return -1;
      if (b.id === "folder-imported") return 1;
      return 0;
    });
    
    return sortedItems.map(item => (
      <DocumentTreeItem 
        key={item.id} 
        item={item} 
        onSelect={onSelectFile} 
        onDelete={handleDeleteItem} 
        onRename={handleRename} 
        onExport={handleExportDocument} 
        onToggleExpanded={toggleFolderExpanded} 
        selectedFile={selectedFile} 
        isImportFolder={item.id === "folder-imported"} 
      />
    ));
  };

  // Get all document IDs for drag and drop functionality
  const getAllItemIds = (items: DocumentItem[], excludeIds: string[] = []): string[] => {
    return items.reduce((acc: string[], item) => {
      if (!excludeIds.includes(item.id)) {
        acc.push(item.id);
        if (item.children && item.children.length > 0) {
          acc = [...acc, ...getAllItemIds(item.children, excludeIds)];
        }
      }
      return acc;
    }, []);
  };

  // Exclude the "Importados" folder from draggable items
  const itemIds = getAllItemIds(documents, ["folder-imported"]);
  
  return (
    <div className="relative flex h-full">
      {/* Botão flutuante para recolher/expandir a sidebar */}
      <div 
        className={cn(
          "absolute top-4 right-0 z-50 transform transition-transform duration-300",
          sidebarCollapsed ? "translate-x-10" : "translate-x-5"
        )}
      >
        <Button
          variant="default"
          size="icon"
          className="rounded-full h-8 w-8 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(130,80,223,0.4)]"
          onClick={() => setSidebarCollapsed(prev => !prev)}
          aria-label={sidebarCollapsed ? "Expandir barra" : "Recolher barra"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-white" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div 
            className={cn(
              "h-full flex flex-col bg-card/95 dark:bg-gray-900/90 backdrop-blur-md",
              "border-r dark:border-gray-800",
              "overflow-hidden"
            )}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ExplorerHeader onAddItem={handleAddItem} />
            <div className="overflow-auto flex-1 p-2">
              <DndProvider items={itemIds} onDragEnd={handleDragEnd}>
                <Tree className="min-h-[200px]">
                  {renderItems(documents)}
                </Tree>
              </DndProvider>
            </div>
            <NewItemDialog 
              open={newItemDialogOpen} 
              onOpenChange={setNewItemDialogOpen} 
              onCreateItem={handleCreateItem} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DocumentExplorer: React.FC<DocumentExplorerProps> = (props) => {
  return (
    <DocumentProvider>
      <DocumentExplorerContent {...props} />
    </DocumentProvider>
  );
};

export default DocumentExplorer;
