
import React, { useState, useCallback, useEffect } from "react";
import SpreadsheetExplorer from "@/components/common/explorer/SpreadsheetExplorer";
import SpreadsheetContent from "./SpreadsheetContent";
import SpreadsheetToolbar from "./SpreadsheetToolbar";
import { DocumentItem } from "../document-explorer/types";
import CollapseButton from "@/components/common/buttons/CollapseButton";

const SpreadsheetEditor = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentItem | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use callback for better performance
  const handleSelectFile = useCallback((file: DocumentItem | null) => {
    setSelectedFile(file);
  }, []);
  
  // Toggle sidebar with animation
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);
  
  // Simulate loading for smoother transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1 max-w-sm">
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full relative transition-all duration-300 ease-in-out">
      {!sidebarCollapsed ? (
        <>
          <div className="border-b md:border-b-0 md:border-r transition-all duration-300 animate-fade-in">
            <SpreadsheetExplorer 
              onSelectFile={handleSelectFile} 
              selectedFile={selectedFile} 
            />
          </div>
          <div className="flex flex-col h-full relative transition-all duration-300 animate-fade-in">
            <CollapseButton 
              isCollapsed={false}
              onClick={toggleSidebar}
              className="hidden md:flex absolute top-2 left-2 z-10 transition-transform hover:scale-110"
              position="right"
            />
            <SpreadsheetToolbar />
            <SpreadsheetContent selectedFile={selectedFile} />
          </div>
        </>
      ) : (
        <div className="col-span-1 md:col-span-2 flex flex-col h-full relative transition-all duration-300 animate-fade-in">
          <CollapseButton 
            isCollapsed={true}
            onClick={toggleSidebar}
            className="hidden md:flex absolute top-2 left-2 z-10 transition-transform hover:scale-110"
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
