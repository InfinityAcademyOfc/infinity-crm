
import { useState, memo } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanColumnItem, KanbanCardItem } from "./types";
import KanbanCard from "./KanbanCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanColumnProps {
  column: KanbanColumnItem;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
  onDragStart: (cardId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  width?: string;
  cardContent?: (card: KanbanCardItem) => React.ReactNode;
  modern?: boolean;
  onMoveCard?: (cardId: string, columnId: string, action: 'move' | 'duplicate') => void;
}

// Usando memo para melhorar a performance de renderização
const KanbanColumn = memo(({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
  width = "280px",
  cardContent,
  modern = true,
  onMoveCard,
}: KanbanColumnProps) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (cardId: string) => {
    onDragStart(cardId, column.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsOver(false);
    onDrop(e, column.id);
  };

  const handleCardDelete = (cardId: string) => {
    if (onDeleteCard) {
      onDeleteCard(cardId, column.id);
    }
  };

  const handleCardEdit = (cardId: string) => {
    if (onEditCard) {
      onEditCard(cardId, column.id);
    }
  };

  const handleMoveCard = (cardId: string, action: 'move' | 'duplicate') => {
    if (onMoveCard) {
      onMoveCard(cardId, column.id, action);
    }
  };

  return (
    <div
      className={`kanban-column flex-shrink-0 rounded-lg flex flex-col ${column.color || "bg-gray-200 dark:bg-gray-800"}`}
      style={{ width }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header sticky top-0 z-10 px-3 py-2 flex items-center justify-between bg-opacity-95 backdrop-blur-sm" 
           style={{ backgroundColor: 'inherit', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}>
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold truncate">{column.title}</h3>
          <div className="kanban-column-badge px-1.5 py-0.5 text-xs rounded-full bg-white/80 dark:bg-gray-700/80">
            {column.cards.length}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-1.5">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="flex items-center gap-2 cursor-pointer">
              <Pencil size={14} />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onDelete} 
              className="text-red-500 focus:text-red-500 flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={14} />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={`kanban-column-content flex-1 p-2 overflow-y-auto transition-colors ${
          isOver ? "bg-primary/5 dark:bg-primary/10" : ""
        }`}
        style={{ maxHeight: "calc(100% - 42px)" }}
      >
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onDragStart={() => handleDragStart(card.id)}
            onClick={() => handleCardEdit(card.id)}
            onDelete={() => handleCardDelete(card.id)}
            onMove={(action) => handleMoveCard(card.id, action)}
            modern={modern}
          >
            {cardContent ? cardContent(card) : null}
          </KanbanCard>
        ))}

        {onAddCard && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
            onClick={() => onAddCard(column.id)}
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar</span>
          </Button>
        )}
      </div>
    </div>
  );
});

// Definir displayName para o componente memo
KanbanColumn.displayName = "KanbanColumn";

export default KanbanColumn;
