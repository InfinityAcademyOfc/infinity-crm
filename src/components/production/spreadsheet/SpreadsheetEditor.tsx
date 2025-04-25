
import React, { useState } from "react";
import SpreadsheetExplorer from "@/components/common/explorer/SpreadsheetExplorer";
import SpreadsheetContent from "./SpreadsheetContent";
import SpreadsheetToolbar from "./SpreadsheetToolbar";
import { DocumentItem } from "../document-explorer/types";

const SpreadsheetEditor = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);

  return (
    <div className="grid grid-cols-[300px_1fr] h-full">
      <SpreadsheetExplorer 
        onSelectFile={setSelectedFile} 
        selectedFile={selectedFile} 
      />
      <div className="flex flex-col h-full">
        <SpreadsheetToolbar />
        <SpreadsheetContent selectedFile={selectedFile} />
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
