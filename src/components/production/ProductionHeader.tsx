
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, RefreshCw } from "lucide-react";

interface ProductionHeaderProps {
  isSyncing: boolean;
  onSyncModules: () => void;
  onNewTask: () => void;
}

export const ProductionHeader: React.FC<ProductionHeaderProps> = ({
  isSyncing,
  onSyncModules,
  onNewTask
}) => {
  return (
    <Card className="p-2 sm:p-4 backdrop-blur-md shadow-md border border-border/40 bg-transparent">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
            <Filter size={14} />
            <span className="text-xs">Filtrar</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
            <Download size={14} />
            <span className="text-xs">Exportar</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 h-8" 
            onClick={onSyncModules} 
            disabled={isSyncing}
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            <span className="text-xs">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1 h-8" onClick={onNewTask}>
            <Plus size={14} />
            <span className="text-xs">Nova Tarefa</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
