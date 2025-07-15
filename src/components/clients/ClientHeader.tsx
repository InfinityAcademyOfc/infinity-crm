
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClientHeaderProps {
  totalClients: number;
  leadsCount: number;
  onNewClient: () => void;
  onConvertLead: () => void;
  onExport: () => void;
}

export const ClientHeader = ({ 
  totalClients, 
  leadsCount, 
  onNewClient, 
  onConvertLead, 
  onExport 
}: ClientHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
        <p className="text-muted-foreground">
          {totalClients} clientes cadastrados
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {leadsCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onConvertLead}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Converter Lead ({leadsCount})
          </Button>
        )}
        
        <Button size="sm" onClick={onNewClient}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
        
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
