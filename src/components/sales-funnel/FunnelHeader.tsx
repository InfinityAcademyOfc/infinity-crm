
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, BarChart2 } from "lucide-react";

interface FunnelHeaderProps {
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  onAddNewLead: () => void;
}

export function FunnelHeader({ 
  showAnalytics, 
  setShowAnalytics, 
  filterMenuOpen, 
  setFilterMenuOpen,
  onAddNewLead 
}: FunnelHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 p-2 bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md rounded-md">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 flex items-center gap-1"
          onClick={() => setFilterMenuOpen(!filterMenuOpen)}
        >
          <Filter className="h-4 w-4" />
          <span className="text-xs">Filtrar</span>
        </Button>
        
        <Button 
          variant={showAnalytics ? "default" : "outline"}
          size="sm" 
          className="h-8 flex items-center gap-1"
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          <BarChart2 className="h-4 w-4" />
          <span className="text-xs">Analytics</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="text-xs">Exportar</span>
        </Button>
      </div>
      
      <Button 
        size="sm" 
        className="h-8 flex items-center gap-1"
        onClick={onAddNewLead}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
