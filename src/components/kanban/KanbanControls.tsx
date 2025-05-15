
import { ChevronDown, ChevronUp, Maximize2, Minimize2, Plus, User, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanCardAssignee } from "./types";

interface KanbanControlsProps {
  zoomLevel: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  onAddColumn: () => void;
  assignees: KanbanCardAssignee[];
  filterByAssignee: string | null;
  setFilterByAssignee: (assignee: string | null) => void;
  toggleExpand: () => void;
  isExpanded: boolean;
}

const KanbanControls = ({
  zoomLevel,
  increaseZoom,
  decreaseZoom,
  onAddColumn,
  assignees,
  filterByAssignee,
  setFilterByAssignee,
  toggleExpand,
  isExpanded,
}: KanbanControlsProps) => {
  const handleFilterChange = (value: string) => {
    setFilterByAssignee(value === "all" ? null : value);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-2 bg-background rounded-lg border shadow-sm">
      <div className="flex items-center gap-2">
        <Button onClick={onAddColumn} variant="default" size="sm" className="gap-1">
          <Plus size={16} />
          <span>Nova Coluna</span>
        </Button>
        
        <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />
        
        <div className="flex items-center rounded-md border bg-background shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={decreaseZoom}
            disabled={zoomLevel <= 0.5}
            title="Reduzir"
          >
            <ZoomOut size={14} />
          </Button>
          <div className="flex items-center justify-center font-mono text-xs px-2 border-l border-r">
            {Math.round(zoomLevel * 100)}%
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={increaseZoom}
            disabled={zoomLevel >= 2}
            title="Ampliar"
          >
            <ZoomIn size={14} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {assignees.length > 0 && (
          <Select 
            defaultValue={filterByAssignee || "all"} 
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <div className="flex items-center gap-1">
                <User size={14} />
                <SelectValue placeholder="Filtrar por responsável" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Responsáveis</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    <div className="flex items-center gap-2">
                      {assignee.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={toggleExpand}
          title={isExpanded ? "Minimizar" : "Expandir"}
        >
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      </div>
    </div>
  );
};

export default KanbanControls;
