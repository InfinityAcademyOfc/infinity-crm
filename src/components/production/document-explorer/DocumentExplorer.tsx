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

const initialDocuments: DocumentItem[] = [{
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
}];

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
    setDocuments,
    searchQuery,
    selectedFolder,
    setSelectedFolder
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
    toggleFolderExpanded
  } = useDocumentOperations(onSelectFile);
  
  const renderItems = (items: DocumentItem[]) => {
    if (!items || items.length === 0) return null;
    const filteredItems = searchQuery ? items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.children && item.children.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()))) : items;
    return filteredItems.map(item => <DocumentTreeItem key={item.id} item={item} onSelect={onSelectFile} onDelete={handleDeleteItem} onRename={handleRename} onExport={handleExportDocument} onToggleExpanded={toggleFolderExpanded} selectedFile={selectedFile} />);
  };

  if (sidebarCollapsed) {
    return <div className="h-full min-h-[300px] flex flex-col items-start justify-start">
        <Button size="icon" variant="ghost" className="m-2" title="Expandir barra" onClick={() => setSidebarCollapsed(false)}>
          <ChevronRight />
        </Button>
      </div>;
  }

  return <div className="h-full border-r flex flex-col transition-all">
      <div className="flex items-center p-2 pb-0 pt-2">
        
        
        
        
      </div>
      <ExplorerHeader onAddItem={handleAddItem} />
      <div className="overflow-auto flex-1 p-2">
        <Tree className="min-h-[200px]">{renderItems(documents)}</Tree>
      </div>
      <NewItemDialog open={newItemDialogOpen} onOpenChange={setNewItemDialogOpen} onCreateItem={handleCreateItem} />
    </div>;
};

const DocumentExplorer: React.FC<DocumentExplorerProps> = props => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  return <DocumentProvider>
      <DocumentExplorerContent {...props} />
    </DocumentProvider>;
};

export default DocumentExplorer;
