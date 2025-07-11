
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Calendar, Search } from "lucide-react";

interface MeetingFiltersProps {
  isFilterOpen: boolean;
  searchQuery: string;
  dateFilter: string;
  responsibleFilter: string;
  responsibles: string[];
  onToggleFilter: () => void;
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onResponsibleFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  isFilterOpen,
  searchQuery,
  dateFilter,
  responsibleFilter,
  responsibles,
  onToggleFilter,
  onSearchChange,
  onDateFilterChange,
  onResponsibleFilterChange,
  onClearFilters
}) => {
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
        onClick={onToggleFilter}
      >
        <Filter size={16} className="mr-1" />
        Filtrar
      </Button>

      {isFilterOpen && (
        <div className="p-4 border rounded-lg bg-card shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar reuniões..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Data</label>
              <Input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => onDateFilterChange(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Responsável</label>
              <Select value={responsibleFilter} onValueChange={onResponsibleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os responsáveis</SelectItem>
                  {responsibles.map((responsible, index) => (
                    <SelectItem key={index} value={responsible}>
                      {responsible}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearFilters}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
