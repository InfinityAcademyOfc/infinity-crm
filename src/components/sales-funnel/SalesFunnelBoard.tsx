
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { KanbanColumnItem } from "@/components/kanban/types";

interface SalesFunnelBoardProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
}

export const SalesFunnelBoard = ({
  columns,
  setColumns,
  onAddCard,
  onEditCard,
  onDeleteCard
}: SalesFunnelBoardProps) => {
  // Wrap the onEditCard to match KanbanBoard expectations
  const handleEditCard = (card: any) => {
    if (onEditCard) {
      onEditCard(card.id);
    }
  };

  return (
    <div className="pb-6">
      <KanbanBoard 
        columns={columns}
        setColumns={setColumns}
        onAddCard={onAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={onDeleteCard}
      />
    </div>
  );
};
