
import React, { useState, useEffect } from "react";
import { SpreadsheetGrid } from "./SpreadsheetGrid";
import SpreadsheetToolbar from "./SpreadsheetToolbar";
import { useSpreadsheet } from "./useSpreadsheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, File, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DocumentItem } from "../document-explorer/types";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const SpreadsheetEditor = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<DocumentItem | null>(null);
  const [newSpreadsheetName, setNewSpreadsheetName] = useState("");
  const [spreadsheets, setSpreadsheets] = useState<DocumentItem[]>([
    { id: "folder-spreadsheets", name: "Minhas Planilhas", type: "folder", expanded: true, children: [
      { id: "file-1", name: "Orçamentos 2024", type: "file", content: "" },
      { id: "file-2", name: "Controle de Produção", type: "file", content: "" },
      { id: "file-3", name: "Relatório Mensal", type: "file", content: "" }
    ]},
    { id: "folder-templates", name: "Templates", type: "folder", expanded: false, children: [
      { id: "template-1", name: "Orçamento Padrão", type: "file", content: "" },
      { id: "template-2", name: "Cronograma", type: "file", content: "" }
    ]}
  ]);
  
  const { toast } = useToast();
  const { 
    gridData, 
    setGridData,
    createSpreadsheet,
    fetchSpreadsheets
  } = useSpreadsheet();

  useEffect(() => {
    fetchSpreadsheets();
  }, [fetchSpreadsheets]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSelectSpreadsheet = (file: DocumentItem) => {
    if (file.type === "file") {
      setSelectedSpreadsheet(file);
      toast({
        title: "Planilha aberta",
        description: `${file.name} foi aberta com sucesso.`
      });
    }
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGridData = [...gridData];
    
    // Ensure the row exists
    while (newGridData.length <= row) {
      newGridData.push([]);
    }
    
    // Ensure the cell exists in this row
    if (!newGridData[row]) {
      newGridData[row] = [];
    }
    
    // Update the cell value
    if (!newGridData[row][col]) {
      newGridData[row][col] = { value };
    } else {
      newGridData[row][col] = { ...newGridData[row][col], value };
    }
    
    setGridData(newGridData);
  };

  const handleCreateSpreadsheet = async () => {
    if (!newSpreadsheetName) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a nova planilha",
        variant: "destructive"
      });
      return;
    }

    // Create new spreadsheet
    const newId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSpreadsheet: DocumentItem = {
      id: newId,
      name: newSpreadsheetName,
      type: "file",
      content: ""
    };

    // Add to "Minhas Planilhas" folder
    const updatedSpreadsheets = spreadsheets.map(item => {
      if (item.id === "folder-spreadsheets") {
        return {
          ...item,
          expanded: true,
          children: [...(item.children || []), newSpreadsheet]
        };
      }
      return item;
    });

    setSpreadsheets(updatedSpreadsheets);
    setSelectedSpreadsheet(newSpreadsheet);
    setNewSpreadsheetName("");
    
    toast({
      title: "Planilha criada",
      description: `${newSpreadsheetName} foi criada com sucesso.`
    });
  };

  const renderTreeItem = (item: DocumentItem, depth: number = 0) => {
    const isFolder = item.type === 'folder';
    const isExpanded = item.expanded;
    
    return (
      <div key={item.id} className="flex flex-col">
        <div 
          className={cn(
            "flex items-center px-2 py-1 rounded-sm cursor-pointer text-sm",
            "hover:bg-gray-100 dark:hover:bg-gray-700/50",
            selectedSpreadsheet?.id === item.id ? "bg-gray-100 dark:bg-gray-700/70" : "",
            "transition-colors duration-150"
          )}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
          onClick={() => {
            if (isFolder) {
              const updatedSpreadsheets = spreadsheets.map(i => 
                i.id === item.id ? { ...i, expanded: !i.expanded } : i
              );
              setSpreadsheets(updatedSpreadsheets);
            } else {
              handleSelectSpreadsheet(item);
            }
          }}
        >
          <div className="mr-2">
            {isFolder ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
              )
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            )}
          </div>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</span>
        </div>
        
        {isFolder && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

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
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full border-r dark:border-gray-800 overflow-hidden bg-card/90 dark:bg-gray-800/50 backdrop-blur-md"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-3 border-b">
                  <h3 className="font-medium text-sm">Planilhas</h3>
                </div>
                
                <div className="p-3 border-b">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nova planilha" 
                      value={newSpreadsheetName}
                      onChange={(e) => setNewSpreadsheetName(e.target.value)}
                      className="h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateSpreadsheet();
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 dark:hover:shadow-[0_0_5px_rgba(125,90,250,0.3)]"
                      onClick={handleCreateSpreadsheet}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {spreadsheets.map(item => renderTreeItem(item))}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content area */}
        <div className={cn("flex-grow transition-all duration-300 flex flex-col", sidebarCollapsed ? "pl-5" : "")}>
          {selectedSpreadsheet ? (
            <>
              <SpreadsheetToolbar />
              <div className="flex-1 overflow-hidden">
                <SpreadsheetGrid 
                  data={gridData.length > 0 ? gridData : Array(50).fill(0).map(() => Array(20).fill({ value: '' }))}
                  onCellChange={handleCellChange}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 p-5">
              <Card className="max-w-md w-full p-6 dark:shadow-[0_0_15px_rgba(125,90,250,0.1)]">
                <div className="text-center space-y-4">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
                  <h3 className="text-lg font-medium">Bem-vindo às Planilhas</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione uma planilha existente ou crie uma nova para começar
                  </p>
                  
                  <div className="pt-4 flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      <Input 
                        placeholder="Nome da planilha" 
                        value={newSpreadsheetName}
                        onChange={(e) => setNewSpreadsheetName(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleCreateSpreadsheet}>
                        <Plus className="h-4 w-4 mr-1" />
                        Criar
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Suas planilhas são salvas automaticamente enquanto você trabalha
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
