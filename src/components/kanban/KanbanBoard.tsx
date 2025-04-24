
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import KanbanControls from "./KanbanControls";
import KanbanColumnDialog from "./KanbanColumnDialog";
import KanbanColumnList from "./KanbanColumnList";
import { KanbanCardItem, KanbanColumnItem } from "./types";
import { 
  getUniqueAssignees, 
  filterColumnsByAssignee, 
  getResponsiveColumnWidth,
  getContainerHeight
} from "./utils/kanbanUtils";

interface KanbanBoardProps {
  columns: KanbanColumnItem[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (cardId: string, columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
  onColumnUpdate?: (columns: KanbanColumnItem[]) => void;
  cardContent?: (card: KanbanCardItem) => React.ReactNode;
  modern?: boolean;
}

const KanbanBoard = ({
  columns,
  setColumns,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onColumnUpdate,
  cardContent,
  modern = true,
}: KanbanBoardProps) => {
  const {
    activeCard,
    activeColumn,
    zoomLevel,
    isAddColumnOpen,
    isEditColumnOpen,
    newColumnTitle,
    newColumnColor,
    selectedColumn,
    filterByAssignee,
    isExpanded,
    setIsAddColumnOpen,
    setIsEditColumnOpen,
    setNewColumnTitle,
    setNewColumnColor,
    setFilterByAssignee,
    increaseZoom,
    decreaseZoom,
    toggleExpand,
    handleDragStart,
    handleDrop,
    handleAddColumn,
    handleDeleteColumn,
    openEditColumn,
    handleEditColumn
  } = useKanbanBoard(columns, onColumnUpdate);

  // Get unique assignees from all cards
  const assignees = getUniqueAssignees(columns);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropEvent = (e: React.DragEvent, targetColumnId: string) => {
    handleDrop(e, targetColumnId, columns, setColumns);
  };

  const handleAddColumnEvent = () => {
    handleAddColumn(columns, setColumns);
  };

  const handleDeleteColumnEvent = (columnId: string) => {
    handleDeleteColumn(columnId, columns, setColumns);
  };

  const handleEditColumnEvent = () => {
    handleEditColumn(columns, setColumns);
  };

  // Filter columns based on assignee
  const filteredColumns = filterColumnsByAssignee(columns, filterByAssignee);

  // Calculate responsive column width
  const columnWidth = getResponsiveColumnWidth(filteredColumns, zoomLevel, isExpanded);
  
  // Calculate container height
  const containerHeight = getContainerHeight(isExpanded);

  return (
    <div className={cn("transition-all duration-300", isExpanded ? "scale-100" : "scale-95")}>
      <KanbanControls 
        zoomLevel={zoomLevel}
        increaseZoom={increaseZoom}
        decreaseZoom={decreaseZoom}
        onAddColumn={() => setIsAddColumnOpen(true)}
        assignees={assignees}
        filterByAssignee={filterByAssignee}
        setFilterByAssignee={setFilterByAssignee}
        toggleExpand={toggleExpand}
        isExpanded={isExpanded}
      />

      <KanbanColumnList 
        columns={columns}
        filteredColumns={filteredColumns}
        columnWidth={columnWidth}
        onAddCard={onAddCard}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDropEvent}
        openEditColumn={openEditColumn}
        handleDeleteColumn={handleDeleteColumnEvent}
        cardContent={cardContent}
        modern={modern}
        containerHeight={containerHeight}
      />

      {/* Add Column Dialog */}
      <KanbanColumnDialog 
        isOpen={isAddColumnOpen}
        onOpenChange={setIsAddColumnOpen}
        title="Adicionar Nova Coluna"
        columnTitle={newColumnTitle}
        setColumnTitle={setNewColumnTitle}
        columnColor={newColumnColor}
        setColumnColor={setNewColumnColor}
        onSave={handleAddColumnEvent}
      />

      {/* Edit Column Dialog */}
      <KanbanColumnDialog 
        isOpen={isEditColumnOpen}
        onOpenChange={setIsEditColumnOpen}
        title="Editar Coluna"
        columnTitle={newColumnTitle}
        setColumnTitle={setNewColumnTitle}
        columnColor={newColumnColor}
        setColumnColor={setNewColumnColor}
        onSave={handleEditColumnEvent}
        isEdit={true}
      />
    </div>
  );
};

export default KanbanBoard;
