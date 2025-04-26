
import React, { useState, useCallback, useEffect } from "react";
import SpreadsheetExplorer from "@/components/common/explorer/SpreadsheetExplorer";
import SpreadsheetContent from "./SpreadsheetContent";
import SpreadsheetToolbar from "./SpreadsheetToolbar";
import { DocumentItem } from "../document-explorer/types";
import CollapseButton from "@/components/common/buttons/CollapseButton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="h-full flex flex-col md:flex-row relative transition-all duration-300 ease-in-out">
      <div 
        className={cn(
          "border-r transition-all duration-300 overflow-hidden bg-card/80 dark:bg-gray-800/40 backdrop-blur-md",
          sidebarCollapsed ? "w-0" : "w-full md:w-[300px] flex-shrink-0"
        )}
      >
        {!sidebarCollapsed && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-2 border-b">
              <h3 className="font-medium text-sm">Arquivos</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hidden md:flex"
                onClick={toggleSidebar}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SpreadsheetExplorer 
                onSelectFile={handleSelectFile} 
                selectedFile={selectedFile} 
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 h-full relative transition-all duration-300 animate-fade-in">
        {sidebarCollapsed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 left-2 h-6 w-6 z-10 hidden md:flex"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        <SpreadsheetToolbar />
        <SpreadsheetContent selectedFile={selectedFile} />
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
