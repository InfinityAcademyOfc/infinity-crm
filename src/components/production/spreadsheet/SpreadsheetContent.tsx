
import React, { useState, useMemo } from "react";
import { DocumentItem, SpreadsheetSheet } from "../document-explorer/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export interface SpreadsheetContentProps {
  selectedFile: DocumentItem | null;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ selectedFile }) => {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
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
        data: Array(10).fill(Array(10).fill(''))
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
      </div>
    );
  }
  
  return (
    <div className="h-full border-t transition-all duration-300 animate-fade-in">
      <div className="p-2 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 transition-all">{selectedFile.name}</h3>
        
        {/* Sheet tabs with horizontal scroll */}
        {sheets.length > 1 && (
          <ScrollArea className="w-full mb-4 border-b">
            <div className="flex pb-2">
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
        
        {/* Responsive spreadsheet grid with horizontal scroll */}
        <ScrollArea className="w-full overflow-x-auto">
          {isLoading ? (
            <div className="grid grid-cols-5 gap-1 min-w-[800px]">
              {Array(5).fill(0).map((_, rowIdx) => (
                <React.Fragment key={`skeleton-row-${rowIdx}`}>
                  {Array(5).fill(0).map((_, colIdx) => (
                    <Skeleton 
                      key={`skeleton-${rowIdx}-${colIdx}`}
                      className="h-7 sm:h-8"
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="min-w-[800px] transition-all duration-300">
              <div className="grid grid-cols-10 gap-0.5">
                {Array(10).fill(0).map((_, rowIdx) => (
                  <React.Fragment key={`row-${rowIdx}`}>
                    {Array(10).fill(0).map((_, colIdx) => {
                      const cellValue = activeSheet?.data?.[rowIdx]?.[colIdx];
                      const displayValue = rowIdx === 0 ? 
                        String.fromCharCode(65 + colIdx) : 
                        colIdx === 0 ? rowIdx : cellValue || '';
                      
                      const isHeader = rowIdx === 0 || colIdx === 0;
                      
                      return (
                        <div 
                          key={`cell-${rowIdx}-${colIdx}`}
                          className={`border h-7 sm:h-8 px-1 sm:px-2 flex items-center text-xs sm:text-sm transition-colors
                            ${isHeader ? 'bg-muted/50 font-medium' : 'hover:bg-muted/20'}`}
                        >
                          {displayValue}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

// Export with memo for performance optimization
export default React.memo(SpreadsheetContent);
