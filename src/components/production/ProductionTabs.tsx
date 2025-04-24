
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionKanban from "./ProductionKanban";
import { KanbanColumnItem } from "@/components/kanban/types";
import MindMap from "./MindMap";
import DocumentEditor from "./DocumentEditor";
import GanttChart from "./gantt/GanttChart";
import SpreadsheetEditor from "./spreadsheet/SpreadsheetEditor";
import { DocumentProvider } from "./document-explorer/contexts/DocumentContext";

interface ProductionTabsProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
}

const ProductionTabs = ({ columns, setColumns }: ProductionTabsProps) => {
  const [activeTab, setActiveTab] = useState("documentos");

  return (
    <Tabs defaultValue="documentos" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 w-full md:w-fit mb-6 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md metallic-item">
        <TabsTrigger value="documentos" className="text-sm px-4">Documentos</TabsTrigger>
        <TabsTrigger value="planilhas" className="text-sm px-4">Planilhas</TabsTrigger>
        <TabsTrigger value="gantt" className="text-sm px-4">Gráfico Gantt</TabsTrigger>
        <TabsTrigger value="kanban" className="text-sm px-4">Kanban</TabsTrigger>
        <TabsTrigger value="mapamental" className="text-sm px-4">Mapa Mental</TabsTrigger>
      </TabsList>
      
      <div className="relative min-h-[600px]">
        <TabsContent value="documentos" className="mt-0">
          <DocumentProvider>
            <DocumentEditor />
          </DocumentProvider>
        </TabsContent>
        
        <TabsContent value="planilhas" className="mt-0">
          <SpreadsheetEditor />
        </TabsContent>
        
        <TabsContent value="gantt" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
          <GanttChart />
        </TabsContent>
        
        <TabsContent value="kanban" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
          <div className="h-[842px]">
            <ProductionKanban columns={columns} setColumns={setColumns} />
          </div>
        </TabsContent>
        
        <TabsContent value="mapamental" className="mt-0 bg-transparent dark:bg-transparent backdrop-blur-sm shadow-md rounded-lg">
          <MindMap />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProductionTabs;
