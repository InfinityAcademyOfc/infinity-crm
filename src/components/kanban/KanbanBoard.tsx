
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, DollarSign, User } from 'lucide-react';
import { KanbanColumnItem, KanbanCardItem } from './types';

interface KanbanBoardProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
}

export default function KanbanBoard({ 
  columns, 
  setColumns, 
  onAddCard,
  onEditCard,
  onDeleteCard 
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const sourceCards = Array.from(sourceColumn.cards);
    const destCards = sourceColumn === destColumn ? sourceCards : Array.from(destColumn.cards);
    
    const [movedCard] = sourceCards.splice(source.index, 1);
    destCards.splice(destination.index, 0, movedCard);

    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        return { ...column, cards: sourceCards };
      }
      if (column.id === destination.droppableId) {
        return { ...column, cards: destCards };
      }
      return column;
    });

    setColumns(newColumns);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="outline" className="ml-auto">
                  {column.cards.length}
                </Badge>
              </div>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors ${
                    snapshot.isDraggingOver 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent'
                  }`}
                >
                  {column.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-move transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'
                          }`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-sm font-medium line-clamp-2">
                                {card.title}
                              </CardTitle>
                              {card.priority && (
                                <Badge variant={getPriorityColor(card.priority)} className="ml-2">
                                  {getPriorityLabel(card.priority)}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0 space-y-2">
                            {card.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {card.description}
                              </p>
                            )}
                            
                            {card.value && (
                              <div className="flex items-center text-xs text-green-600">
                                <DollarSign className="h-3 w-3 mr-1" />
                                R$ {card.value.toLocaleString('pt-BR')}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              {card.dueDate && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                                </div>
                              )}
                              
                              {card.assignedTo && (
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {typeof card.assignedTo === 'string' 
                                      ? card.assignedTo.substring(0, 2).toUpperCase()
                                      : card.assignedTo.name.substring(0, 2).toUpperCase()
                                    }
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                            
                            {card.tags && card.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {card.tags.slice(0, 2).map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {typeof tag === 'string' ? tag : tag.label}
                                  </Badge>
                                ))}
                                {card.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{card.tags.length - 2}
                                  </Badge>
                                )}
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
}
