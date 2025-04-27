
import { KanbanColumnItem } from "./types";
import KanbanColumn from "./KanbanColumn";

interface KanbanColumnListProps {
  columns: KanbanColumnItem[];
  filteredColumns: KanbanColumnItem[];
  columnWidth: string;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
  handleDragStart: (cardId: string, columnId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetColumnId: string) => void;
  openEditColumn: (column: KanbanColumnItem) => void;
  handleDeleteColumn: (columnId: string) => void;
  cardContent?: any;
  modern?: boolean;
  containerHeight?: string;
  onMoveCard?: (cardId: string, columnId: string, action: 'move' | 'duplicate') => void;
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
  modern,
  containerHeight,
  onMoveCard
}: KanbanColumnListProps) => {
  return (
    <div className="kanban-board flex p-2 gap-4" style={{ minHeight: containerHeight || '300px' }}>
      {filteredColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
          onDragStart={(cardId, columnId) => handleDragStart(cardId, columnId)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEdit={() => openEditColumn(column)}
          onDelete={() => handleDeleteColumn(column.id)}
          width={columnWidth}
          cardContent={cardContent}
          modern={modern}
          onMoveCard={onMoveCard}
        />
      ))}
    </div>
  );
};

export default KanbanColumnList;
