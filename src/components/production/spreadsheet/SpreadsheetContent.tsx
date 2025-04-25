import React from "react";
import { DocumentItem } from "../document-explorer/types";
import { Skeleton } from "@/components/ui/skeleton";

export interface SpreadsheetContentProps {
  selectedFile: DocumentItem | null;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ selectedFile }) => {
  if (!selectedFile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-muted-foreground">
        <p>Selecione um arquivo para visualizar ou editar</p>
      </div>
    );
  }

  return (
    <div className="h-full border-t">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">{selectedFile.name}</h3>
        
        {/* Placeholder for spreadsheet content */}
        <div className="grid grid-cols-10 gap-0.5">
          {Array(10).fill(0).map((_, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              {Array(10).fill(0).map((_, colIdx) => (
                <div 
                  key={`cell-${rowIdx}-${colIdx}`}
                  className="border h-8 px-2 flex items-center text-sm"
                >
                  {rowIdx === 0 ? String.fromCharCode(65 + colIdx) : colIdx === 0 ? rowIdx : ''}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetContent;
