
import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart3, Filter, Download, Plus } from "lucide-react";
import { FilterMenu } from "./FilterMenu";

interface FunnelHeaderProps {
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  onAddNewLead: () => void;
  onFiltersApplied: () => void;
}

export function FunnelHeader({ 
  showAnalytics, 
  setShowAnalytics, 
  filterMenuOpen, 
  setFilterMenuOpen, 
  onAddNewLead,
  onFiltersApplied
}: FunnelHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-end w-full">
      {filterMenuOpen && (
        <FilterMenu 
          onClose={() => setFilterMenuOpen(false)} 
          onApply={onFiltersApplied}
        />
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8"
        onClick={() => setFilterMenuOpen(!filterMenuOpen)}
      >
        <Filter className="h-4 w-4 mr-1" />
        Filtrar Funil
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className={`h-8 ${showAnalytics ? 'bg-muted' : ''}`}
        onClick={() => setShowAnalytics(!showAnalytics)}
      >
        <BarChart3 className="h-4 w-4 mr-1" />
        Analytics
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8"
      >
        <Download className="h-4 w-4 mr-1" />
        Exportar
      </Button>
      
      <Button 
        variant="default" 
        size="sm"
        className="h-8"
        onClick={onAddNewLead}
      >
        <Plus className="h-4 w-4 mr-1" />
        Nova Lead
      </Button>
    </div>
  );
}
