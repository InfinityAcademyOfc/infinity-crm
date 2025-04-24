
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { KanbanColumnItem } from "@/components/kanban/types";

interface SalesFunnelBoardProps {
  columns: KanbanColumnItem[];
  setColumns: (columns: KanbanColumnItem[]) => void;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
}

export const SalesFunnelBoard = ({
  columns,
  setColumns,
  onAddCard,
  onEditCard,
  onDeleteCard
}: SalesFunnelBoardProps) => {
  return (
    <div className="pb-6">
      <KanbanBoard 
        columns={columns}
        setColumns={setColumns}
        onAddCard={onAddCard}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
      />
    </div>
  );
};
