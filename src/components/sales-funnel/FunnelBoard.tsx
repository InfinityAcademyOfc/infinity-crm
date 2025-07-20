
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DraggableKanbanBoard } from "./DraggableKanbanBoard";

interface FunnelBoardProps {
  kanbanColumns: any[];
  onDragEnd: (result: any) => void;
  onAddCard: (columnId: string) => void;
  onEditCard: (cardId: string, columnId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export const FunnelBoard: React.FC<FunnelBoardProps> = React.memo(({
  kanbanColumns,
  onDragEnd,
  onAddCard,
  onEditCard,
  onDeleteCard
}) => {
  return (
    <Card className="transition-shadow duration-150 hover:shadow-md">
      <CardContent className="p-6">
        <DraggableKanbanBoard
          columns={kanbanColumns}
          onDragEnd={onDragEnd}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
        />
      </CardContent>
    </Card>
  );
});

FunnelBoard.displayName = 'FunnelBoard';
