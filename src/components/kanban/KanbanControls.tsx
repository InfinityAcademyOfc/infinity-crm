
import { ZoomIn, ZoomOut, PlusSquare, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KanbanControlsProps {
  zoomLevel: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  onAddColumn: () => void;
  assignees: string[];
  filterByAssignee: string | null;
  setFilterByAssignee: (value: string | null) => void;
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
  isExpanded
}: KanbanControlsProps) => {
  return (
    <div className="flex justify-between mb-4 gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={decreaseZoom} className="bg-background">
                <ZoomOut size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reduzir tamanho</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={increaseZoom} className="bg-background">
                <ZoomIn size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Aumentar tamanho</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleExpand} className="bg-background">
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isExpanded ? "Minimizar quadro" : "Expandir quadro"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center gap-2">
        {assignees.length > 0 && (
          <Select 
            value={filterByAssignee || "all"} 
            onValueChange={(value) => setFilterByAssignee(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filtrar por usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              {assignees.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onAddColumn} className="bg-background">
                <PlusSquare size={16} className="mr-2" />
                Nova Coluna
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar nova coluna</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default KanbanControls;
