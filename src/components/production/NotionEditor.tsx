
import React, { useState } from "react";
import { Folder, ChevronDown, ChevronRight, File, Plus, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyTabContent from "./EmptyTabContent";

const NotionEditor = () => {
  const [folders, setFolders] = useState([
    {
      id: "1",
      name: "Projetos",
      expanded: true,
      files: [
        { id: "1-1", name: "Projeto A", content: "## Projeto A\n\nDescrição do projeto A e seus objetivos principais." },
        { id: "1-2", name: "Projeto B", content: "## Projeto B\n\nDetalhes e cronograma do projeto B." }
      ]
    },
    {
      id: "2",
      name: "Documentos",
      expanded: false,
      files: [
        { id: "2-1", name: "Contrato", content: "## Modelo de Contrato\n\nTermos e condições para novos clientes." }
      ]
    },
    {
      id: "3",
      name: "Processos",
      expanded: false,
      files: [
        { id: "3-1", name: "Onboarding", content: "## Processo de Onboarding\n\n1. Reunião inicial\n2. Levantamento de requisitos\n3. Definição de escopo" },
        { id: "3-2", name: "Desenvolvimento", content: "## Etapas de Desenvolvimento\n\n- Planejamento\n- Design\n- Implementação\n- Testes\n- Entrega" }
      ]
    }
  ]);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleFolder = (folderId) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, expanded: !folder.expanded } 
        : folder
    ));
  };
  
  const selectFile = (folderId, fileId) => {
    const folder = folders.find(f => f.id === folderId);
    const file = folder.files.find(f => f.id === fileId);
    setSelectedFile({ folderId, fileId });
    setContent(file.content);
  };
  
  const updateContent = (e) => {
    setContent(e.target.value);
    
    if (selectedFile) {
      const { folderId, fileId } = selectedFile;
      setFolders(folders.map(folder => 
        folder.id === folderId 
          ? {
              ...folder,
              files: folder.files.map(file => 
                file.id === fileId 
                  ? { ...file, content } 
                  : file
              )
            }
          : folder
      ));
    }
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  if (folders.length === 0) {
    return (
      <EmptyTabContent 
        heading="Documentos"
        description="Crie e organize seus documentos."
        buttonText="Criar Documento"
      />
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-md overflow-hidden min-h-[500px] flex">
      {/* Sidebar */}
      <div className={`border-r dark:border-gray-700 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'} transition-all duration-300`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Documentos</h3>
            <Button variant="ghost" size="sm">
              <Plus size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            {folders.map(folder => (
              <div key={folder.id}>
                <div 
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => toggleFolder(folder.id)}
                >
                  {folder.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <Folder size={16} className="mx-2 text-blue-500" />
                  <span>{folder.name}</span>
                </div>
                
                {folder.expanded && (
                  <div className="ml-8 mt-1 space-y-1">
                    {folder.files.map(file => (
                      <div 
                        key={file.id}
                        className={`flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                          selectedFile && selectedFile.fileId === file.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                        onClick={() => selectFile(folder.id, file.id)}
                      >
                        <File size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Toggle sidebar button */}
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-0 z-10"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* Editor */}
      <div className="flex-1 p-4">
        {selectedFile ? (
          <div className="h-full">
            <textarea
              className="w-full h-full min-h-[450px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 border rounded-md dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              value={content}
              onChange={updateContent}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Selecione um documento para editar
          </div>
        )}
      </div>
    </div>
  );
};

export default NotionEditor;
