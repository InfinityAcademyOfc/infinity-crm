
import React, { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DocumentItem } from "../document-explorer/types";
import { useToast } from "@/hooks/use-toast";
import SpreadsheetExplorer from "./SpreadsheetExplorer";
import SpreadsheetContent from "./SpreadsheetContent";
import { SpreadsheetSheet } from "../document-explorer/types";

const SpreadsheetEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSelectFile = (file: DocumentItem) => {
    if (file.type === "file") {
      // Initialize sheets if they don't exist
      if (!file.sheets) {
        file.sheets = [{
          id: `sheet-${Date.now()}`,
          name: "Sheet 1",
          data: Array(20).fill(0).map(() => Array(10).fill(""))
        }];
      }
      
      setSelectedFile(file);
      setActiveSheet(file.sheets[0]?.id || null);
      
      toast({
        title: "Planilha aberta",
        description: `${file.name} foi aberta com sucesso.`
      });
    }
  };
  
  const handleSheetChange = (sheetId: string) => {
    setActiveSheet(sheetId);
  };

  const handleAddSheet = () => {
    if (selectedFile && selectedFile.sheets) {
      const newSheet: SpreadsheetSheet = {
        id: `sheet-${Date.now()}`,
        name: `Sheet ${selectedFile.sheets.length + 1}`,
        data: Array(20).fill(0).map(() => Array(10).fill(""))
      };
      
      selectedFile.sheets.push(newSheet);
      setActiveSheet(newSheet.id);
    }
  };

  const handleRenameSheet = (sheetId: string, newName: string) => {
    if (selectedFile && selectedFile.sheets) {
      const sheet = selectedFile.sheets.find(s => s.id === sheetId);
      if (sheet) {
        sheet.name = newName;
        // Force re-render
        setSelectedFile({...selectedFile});
      }
    }
  };

  const handleDeleteSheet = (sheetId: string) => {
    if (selectedFile && selectedFile.sheets && selectedFile.sheets.length > 1) {
      const index = selectedFile.sheets.findIndex(s => s.id === sheetId);
      if (index !== -1) {
        selectedFile.sheets.splice(index, 1);
        if (activeSheet === sheetId) {
          setActiveSheet(selectedFile.sheets[0].id);
        }
        // Force re-render
        setSelectedFile({...selectedFile});
      }
    }
  };
  
  const handleUpdateData = (sheetId: string, data: any[][]) => {
    if (selectedFile && selectedFile.sheets) {
      const sheet = selectedFile.sheets.find(s => s.id === sheetId);
      if (sheet) {
        sheet.data = data;
      }
    }
  };
  
  const getActiveSheetData = () => {
    if (!selectedFile || !selectedFile.sheets || !activeSheet) return [];
    const sheet = selectedFile.sheets.find(s => s.id === activeSheet);
    return sheet ? sheet.data : [];
  };

  const getActiveSheetName = () => {
    if (!selectedFile || !selectedFile.sheets || !activeSheet) return "";
    const sheet = selectedFile.sheets.find(s => s.id === activeSheet);
    return sheet ? sheet.name : "";
  };
  
  return (
    <div className="h-full border rounded-lg overflow-hidden" style={{ height: '842px' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <SpreadsheetExplorer 
            onSelectFile={handleSelectFile} 
            selectedFile={selectedFile} 
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel>
          {selectedFile && activeSheet ? (
            <SpreadsheetContent 
              data={getActiveSheetData()}
              sheetName={getActiveSheetName()}
              sheets={selectedFile.sheets || []}
              activeSheetId={activeSheet}
              onDataChange={(data) => handleUpdateData(activeSheet, data)}
              onAddSheet={handleAddSheet}
              onRenameSheet={handleRenameSheet}
              onDeleteSheet={handleDeleteSheet}
              onSelectSheet={handleSheetChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p>Selecione uma planilha para editar</p>
                <p className="text-sm">ou crie uma nova na barra lateral</p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SpreadsheetEditor;
