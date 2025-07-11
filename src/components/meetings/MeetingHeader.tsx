
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Video, Calendar, Smartphone } from "lucide-react";
import { MeetingFilters } from "./MeetingFilters";

interface MeetingHeaderProps {
  viewMode: string;
  isFilterOpen: boolean;
  searchQuery: string;
  dateFilter: string;
  responsibleFilter: string;
  responsibles: string[];
  onViewModeChange: (mode: string) => void;
  onStartInstantMeeting: () => void;
  onOpenNewMeeting: () => void;
  onToggleFilter: () => void;
  onSearchChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onResponsibleFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  viewMode,
  isFilterOpen,
  searchQuery,
  dateFilter,
  responsibleFilter,
  responsibles,
  onViewModeChange,
  onStartInstantMeeting,
  onOpenNewMeeting,
  onToggleFilter,
  onSearchChange,
  onDateFilterChange,
  onResponsibleFilterChange,
  onClearFilters
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MeetingFilters
            isFilterOpen={isFilterOpen}
            searchQuery={searchQuery}
            dateFilter={dateFilter}
            responsibleFilter={responsibleFilter}
            responsibles={responsibles}
            onToggleFilter={onToggleFilter}
            onSearchChange={onSearchChange}
            onDateFilterChange={onDateFilterChange}
            onResponsibleFilterChange={onResponsibleFilterChange}
            onClearFilters={onClearFilters}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm ${viewMode === 'calendar' ? 'bg-primary/20' : ''}`}
            onClick={() => onViewModeChange(viewMode === 'calendar' ? 'list' : 'calendar')}
          >
            <Calendar size={16} className="mr-1" />
            Calendário
          </Button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={onStartInstantMeeting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Video size={16} />
            Iniciar Agora
          </Button>
          <Button 
            variant="outline" 
            onClick={onOpenNewMeeting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Nova Reunião
          </Button>
        </div>
      </div>
    </div>
  );
};
