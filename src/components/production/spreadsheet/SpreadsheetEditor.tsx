
import React, { useState } from "react";
import SpreadsheetExplorer from "@/components/common/explorer/SpreadsheetExplorer";
import SpreadsheetContent from "./SpreadsheetContent";
import SpreadsheetToolbar from "./SpreadsheetToolbar";
import { DocumentItem } from "../document-explorer/types";
import CollapseButton from "@/components/common/buttons/CollapseButton";

const SpreadsheetEditor = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full relative">
      {!sidebarCollapsed ? (
        <>
          <div className="border-b md:border-b-0 md:border-r">
            <SpreadsheetExplorer 
              onSelectFile={setSelectedFile} 
              selectedFile={selectedFile} 
            />
          </div>
          <div className="flex flex-col h-full relative">
            <CollapseButton 
              isCollapsed={false}
              onClick={() => setSidebarCollapsed(true)}
              className="hidden md:flex absolute top-2 left-2 z-10"
              position="right"
            />
            <SpreadsheetToolbar />
            <SpreadsheetContent selectedFile={selectedFile} />
          </div>
        </>
      ) : (
        <div className="col-span-1 md:col-span-2 flex flex-col h-full relative">
          <CollapseButton 
            isCollapsed={true}
            onClick={() => setSidebarCollapsed(false)}
            className="hidden md:flex absolute top-2 left-2 z-10"
            position="right"
          />
          <SpreadsheetToolbar />
          <SpreadsheetContent selectedFile={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default SpreadsheetEditor;
