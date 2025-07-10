
import { useState } from "react";
import { cn } from "@/lib/utils";
import { KanbanColumnItem } from "@/components/kanban/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import KanbanCard from "@/components/kanban/KanbanCard";

interface DraggableKanbanBoardProps {
  columns: KanbanColumnItem[];
  onDragEnd: (cardId: string, sourceColumnId: string, targetColumnId: string) => void;
  onAddCard: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
}

export const DraggableKanbanBoard = ({
  columns,
  onDragEnd,
  onAddCard,
  onEditCard,
  onDeleteCard
}: DraggableKanbanBoardProps) => {
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; columnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (cardId: string, columnId: string) => {
    setDraggedCard({ cardId, columnId });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedCard && draggedCard.columnId !== targetColumnId) {
      onDragEnd(draggedCard.cardId, draggedCard.columnId, targetColumnId);
    }
    
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            "flex-shrink-0 w-80 bg-muted/50 rounded-lg p-4 transition-all duration-200",
            dragOverColumn === column.id && "bg-primary/10 ring-2 ring-primary/20"
          )}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: column.color }}
              />
              <h3 className="font-semibold text-sm">{column.title}</h3>
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                {column.cards.length}
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3 mb-4 min-h-[400px]">
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => handleDragStart(card.id, column.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "transition-all duration-200",
                  draggedCard?.cardId === card.id && "opacity-50 rotate-2 scale-105"
                )}
              >
                <KanbanCard
                  card={card}
                  onDragStart={() => {}}
                  onClick={() => onEditCard?.(card.id, column.id)}
                  onDelete={() => onDeleteCard?.(card.id, column.id)}
                  modern={true}
                />
              </div>
            ))}
          </div>

          {/* Add Card Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/20 hover:border-primary/40"
            onClick={() => onAddCard(column.id)}
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Lead</span>
          </Button>
        </div>
      ))}
    </div>
  );
};
