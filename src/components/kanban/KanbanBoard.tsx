
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KanbanColumnItem, KanbanCardItem } from "./types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KanbanBoardProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (card: KanbanCardItem) => void;
  onDeleteCard?: (cardId: string) => void;
}

const KanbanBoard = ({ 
  columns, 
  setColumns, 
  onAddCard, 
  onEditCard, 
  onDeleteCard 
}: KanbanBoardProps) => {
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceCards = Array.from(sourceColumn.cards);
    const draggedCard = sourceCards.find(card => card.id === draggableId);

    if (!draggedCard) return;

    // Remove from source
    sourceCards.splice(source.index, 1);

    if (sourceColumn.id === destColumn.id) {
      // Same column
      sourceCards.splice(destination.index, 0, draggedCard);
      
      const newColumns = columns.map(col => 
        col.id === sourceColumn.id 
          ? { ...col, cards: sourceCards }
          : col
      );
      
      setColumns(newColumns);
    } else {
      // Different columns
      const destCards = Array.from(destColumn.cards);
      destCards.splice(destination.index, 0, draggedCard);

      const newColumns = columns.map(col => {
        if (col.id === sourceColumn.id) {
          return { ...col, cards: sourceCards };
        }
        if (col.id === destColumn.id) {
          return { ...col, cards: destCards };
        }
        return col;
      });

      setColumns(newColumns);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div 
              className="rounded-lg p-3 mb-3 border-l-4"
              style={{ borderLeftColor: column.color }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {column.cards.length}
                  </Badge>
                  {onAddCard && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddCard(column.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] space-y-2 p-2 rounded-lg transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'bg-muted/50' 
                      : 'bg-transparent'
                  }`}
                >
                  {column.cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-move transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                          }`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-sm font-medium line-clamp-2">
                                {card.title}
                              </CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {onEditCard && (
                                    <DropdownMenuItem onClick={() => onEditCard(card)}>
                                      Editar
                                    </DropdownMenuItem>
                                  )}
                                  {onDeleteCard && (
                                    <DropdownMenuItem 
                                      onClick={() => onDeleteCard(card.id)}
                                      className="text-destructive"
                                    >
                                      Excluir
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            {card.description && (
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {card.description}
                              </p>
                            )}
                            
                            {card.value > 0 && (
                              <div className="text-sm font-semibold text-green-600 mb-2">
                                R$ {card.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {card.tags?.map((tag, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="secondary" 
                                    className={`text-xs ${tag.color}`}
                                  >
                                    {tag.label}
                                  </Badge>
                                ))}
                                {card.priority && (
                                  <Badge 
                                    variant="secondary" 
                                    className={`text-xs ${getPriorityColor(card.priority)}`}
                                  >
                                    {card.priority}
                                  </Badge>
                                )}
                              </div>
                              
                              {card.assignedTo && (
                                <div className="flex items-center">
                                  <img
                                    src={card.assignedTo.avatar}
                                    alt={card.assignedTo.name}
                                    className="h-6 w-6 rounded-full"
                                  />
                                </div>
                              )}
                            </div>

                            {card.metadata?.date && (
                              <div className="text-xs text-muted-foreground mt-2">
                                {card.metadata.date}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
