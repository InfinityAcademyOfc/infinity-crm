
import React from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface ClientViewControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewType: string;
  onViewTypeChange: (value: string) => void;
}

export const ClientViewControls = ({
  searchQuery,
  onSearchChange,
  viewType,
  onViewTypeChange
}: ClientViewControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="relative flex-1 w-full sm:max-w-[400px]">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar clientes..." 
          value={searchQuery} 
          onChange={e => onSearchChange(e.target.value)} 
          className="pl-8" 
        />
      </div>
      
      <Tabs value={viewType} onValueChange={onViewTypeChange} className="w-auto">
        <TabsList className="grid grid-cols-3 h-8 w-[240px]">
          <TabsTrigger value="list" className="text-xs">Lista</TabsTrigger>
          <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
