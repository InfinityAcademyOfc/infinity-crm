
import React from "react";
import { cn } from "@/lib/utils";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { KanbanCardItem, KanbanColumnItem } from "./types";

interface KanbanColumnListProps {
  columns: KanbanColumnItem[];
  filteredColumns: KanbanColumnItem[];
  columnWidth: string;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
  handleDragStart: (card: KanbanCardItem, columnId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, columnId: string) => void;
  openEditColumn: (column: KanbanColumnItem) => void;
  handleDeleteColumn: (columnId: string) => void;
  cardContent?: (card: KanbanCardItem) => React.ReactNode;
  modern?: boolean;
  containerHeight: string;
}

const KanbanColumnList = ({
  columns,
  filteredColumns,
  columnWidth,
  onAddCard,
  onEditCard,
  onDeleteCard,
  handleDragStart,
  handleDragOver,
  handleDrop,
  openEditColumn,
  handleDeleteColumn,
  cardContent,
  modern = true,
  containerHeight
}: KanbanColumnListProps) => {
  return (
    <div className={cn(
      "flex gap-3 overflow-x-auto pb-4 custom-scrollbar dark:dark-scrollbar snap-x", 
      containerHeight,
      modern && "kanban-modern"
    )}>
      {filteredColumns.map(column => (
        <div 
          key={column.id} 
          className="flex-shrink-0 snap-start"
          style={{ width: columnWidth, transition: 'width 0.3s ease' }}
        >
          <KanbanColumn 
            title={column.title} 
            color={column.color}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            onEdit={() => openEditColumn(column)}
            onDelete={() => handleDeleteColumn(column.id)}
            modern={modern}
          >
            <div className="space-y-2">
              {column.cards.map(card => (
                <KanbanCard
                  key={card.id}
                  card={card}
                  onDragStart={() => handleDragStart(card, column.id)}
                  onClick={() => onEditCard && onEditCard(card.id, column.id)}
                  onDelete={() => onDeleteCard && onDeleteCard(card.id, column.id)}
                  modern={modern}
                >
                  {cardContent ? cardContent(card) : null}
                </KanbanCard>
              ))}
              {onAddCard && (
                <Button 
                  variant="ghost" 
                  className="w-full flex items-center justify-center gap-2 mt-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => onAddCard(column.id)}
                >
                  <PlusCircle size={16} />
                  <span>Adicionar Card</span>
                </Button>
              )}
            </div>
          </KanbanColumn>
        </div>
      ))}
    </div>
  );
};

export default KanbanColumnList;
