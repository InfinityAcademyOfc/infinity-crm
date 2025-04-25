
import React, { useState } from "react";
import { DocumentProvider } from "../document-explorer/contexts/DocumentContext";
import DocumentExplorer from "../document-explorer/DocumentExplorer";
import { DocumentItem } from "../document-explorer/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpreadsheetExplorerProps {
  onSelectFile: (file: DocumentItem) => void;
  selectedFile: DocumentItem | null;
}

const SpreadsheetExplorer: React.FC<SpreadsheetExplorerProps> = ({ onSelectFile, selectedFile }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (sidebarCollapsed) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-start justify-start">
        <Button
          size="icon"
          variant="ghost"
          className="m-2"
          title="Expandir barra"
          onClick={() => setSidebarCollapsed(false)}
        >
          <ChevronRight />
        </Button>
      </div>
    );
  }

  return (
    <DocumentProvider>
      <div className="h-full border-r flex flex-col transition-all">
        <div className="flex items-center p-2 pb-0 pt-2">
          <span className="text-xs font-bold uppercase mr-2">Planilhas</span>
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto"
            title="Recolher barra"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronLeft />
          </Button>
        </div>
        {/* Reuso do DocumentExplorer apenas para a árvore */}
        <DocumentExplorer onSelectFile={onSelectFile} selectedFile={selectedFile} />
      </div>
    </DocumentProvider>
  );
};

export default SpreadsheetExplorer;
