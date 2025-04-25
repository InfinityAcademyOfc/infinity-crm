
import React, { useState, useEffect, useMemo } from "react";
import { DocumentItem } from "../document-explorer/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SpreadsheetGrid } from './SpreadsheetGrid';
import { useSpreadsheet } from './useSpreadsheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Save, Download } from 'lucide-react';

export interface SpreadsheetContentProps {
  selectedFile: DocumentItem | null;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ selectedFile }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    spreadsheets, 
    currentSpreadsheet,
    currentSheet,
    gridData,
    createSpreadsheet,
    fetchSpreadsheets,
    loadSpreadsheetData,
    updateCellData,
    setGridData
  } = useSpreadsheet();

  const [newSpreadsheetName, setNewSpreadsheetName] = useState('');

  useEffect(() => {
    fetchSpreadsheets();
  }, [fetchSpreadsheets]);

  const handleCreateSpreadsheet = async () => {
    const newSpreadsheet = await createSpreadsheet(newSpreadsheetName || undefined);
    if (newSpreadsheet) {
      await loadSpreadsheetData(newSpreadsheet.id);
      setNewSpreadsheetName('');
    }
  };

  const handleCellChange = async (row: number, col: number, value: string) => {
    if (currentSpreadsheet && currentSheet) {
      await updateCellData(currentSheet.id, row, col, { value });
      
      // Optimistically update local grid data
      const newGridData = [...gridData];
      while (newGridData.length <= row) {
        newGridData.push([]);
      }
      if (!newGridData[row]) {
        newGridData[row] = [];
      }
      newGridData[row][col] = { ...newGridData[row]?.[col], value };
      setGridData(newGridData);
    }
  };
  
  // Use useMemo to optimize the sheets computation
  const sheets = useMemo(() => {
    if (!selectedFile) return [];
    
    // When file changes, briefly show loading state
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
    
    return selectedFile.sheets || [
      {
        id: "default",
        name: "Sheet 1",
        data: Array(20).fill(Array(20).fill(''))
      }
    ];
  }, [selectedFile]);
  
  const activeSheet = useMemo(() => {
    return sheets[activeSheetIndex] || sheets[0];
  }, [sheets, activeSheetIndex]);

  if (!selectedFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-muted-foreground transition-opacity duration-300 animate-fade-in">
        <p>Selecione um arquivo para visualizar ou editar</p>
        
        <div className="mt-8 flex items-center gap-2">
          <Input 
            placeholder="Nome da planilha"
            value={newSpreadsheetName}
            onChange={(e) => setNewSpreadsheetName(e.target.value)}
            className="w-60"
          />
          <Button onClick={handleCreateSpreadsheet} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Criar nova
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col transition-all duration-300 animate-fade-in">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-2 flex items-center justify-between border-b">
          <h3 className="text-base sm:text-lg font-semibold transition-all mr-4">{selectedFile.name}</h3>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>
        
        {/* Sheet tabs with horizontal scroll */}
        {sheets.length > 1 && (
          <ScrollArea className="w-full border-b">
            <div className="flex">
              {sheets.map((sheet, index) => (
                <button
                  key={sheet.id}
                  className={`px-3 sm:px-4 py-1 sm:py-2 text-sm whitespace-nowrap transition-all duration-200
                    ${index === activeSheetIndex ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground hover:bg-muted/30'}`}
                  onClick={() => setActiveSheetIndex(index)}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="grid grid-cols-5 gap-1 p-4">
              {Array(5).fill(0).map((_, rowIdx) => (
                <React.Fragment key={`skeleton-row-${rowIdx}`}>
                  {Array(5).fill(0).map((_, colIdx) => (
                    <Skeleton 
                      key={`skeleton-${rowIdx}-${colIdx}`}
                      className="h-9"
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="h-full transition-all duration-300">
              <SpreadsheetGrid
                data={gridData.length > 0 ? gridData : Array(20).fill(0).map(() => Array(20).fill({ value: '' }))}
                onCellChange={handleCellChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export with memo for performance optimization
export default React.memo(SpreadsheetContent);
