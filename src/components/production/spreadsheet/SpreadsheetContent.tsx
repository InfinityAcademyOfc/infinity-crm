
import React, { useState } from "react";
import { DocumentItem, SpreadsheetSheet } from "../document-explorer/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export interface SpreadsheetContentProps {
  selectedFile: DocumentItem | null;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ selectedFile }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  
  if (!selectedFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-muted-foreground">
        <p>Selecione um arquivo para visualizar ou editar</p>
      </div>
    );
  }
  
  // Get sheets or initialize with default sheet if not present
  const sheets = selectedFile.sheets || [
    {
      id: "default",
      name: "Sheet 1",
      data: Array(10).fill(Array(10).fill(''))
    }
  ];
  
  const activeSheet = sheets[activeSheetIndex] || sheets[0];

  return (
    <div className="h-full border-t">
      <div className="p-2 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">{selectedFile.name}</h3>
        
        {/* Sheet tabs with horizontal scroll */}
        {sheets.length > 1 && (
          <ScrollArea className="w-full mb-4 border-b">
            <div className="flex pb-2">
              {sheets.map((sheet, index) => (
                <button
                  key={sheet.id}
                  className={`px-3 sm:px-4 py-1 sm:py-2 text-sm whitespace-nowrap
                    ${index === activeSheetIndex ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
                  onClick={() => setActiveSheetIndex(index)}
                >
                  {sheet.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {/* Responsive spreadsheet grid with horizontal scroll */}
        <ScrollArea className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-10 gap-0.5">
              {Array(10).fill(0).map((_, rowIdx) => (
                <React.Fragment key={`row-${rowIdx}`}>
                  {Array(10).fill(0).map((_, colIdx) => {
                    const cellValue = activeSheet?.data?.[rowIdx]?.[colIdx];
                    const displayValue = rowIdx === 0 ? 
                      String.fromCharCode(65 + colIdx) : 
                      colIdx === 0 ? rowIdx : cellValue || '';
                    
                    return (
                      <div 
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="border h-7 sm:h-8 px-1 sm:px-2 flex items-center text-xs sm:text-sm"
                      >
                        {displayValue}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SpreadsheetContent;
