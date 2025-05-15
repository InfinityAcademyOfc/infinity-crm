
import { useState, useRef, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

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
    handleDragStart: originalHandleDragStart,
    handleDrop,
    handleAddColumn,
    handleDeleteColumn,
    openEditColumn,
    handleEditColumn
  } = useKanbanBoard(columns, onColumnUpdate);

  // Refs e estado para funcionalidade de arrastar o quadro
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  // Get unique assignees from all cards
  const assignees = getUniqueAssignees(columns);

  // Adapter for handleDragStart to work with string ID instead of KanbanCardItem object
  const handleDragStart = (cardId: string, columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    const card = column.cards.find(card => card.id === cardId);
    if (!card) return;
    
    originalHandleDragStart(card, columnId);
  };

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

  // Event handlers for drag-to-pan funcionality (horizontal and vertical)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if it's not on a kanban card (check for data-draggable attribute)
    if ((e.target as HTMLElement).closest('[data-draggable="true"]')) {
      return;
    }
    
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setScrollPosition({
      x: containerRef.current?.scrollLeft || 0,
      y: containerRef.current?.scrollTop || 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // Calcular a diferença com a posição inicial
    const deltaX = startPosition.x - e.clientX;
    const deltaY = startPosition.y - e.clientY;
    
    // Aplicar a rolagem horizontal e vertical
    containerRef.current.scrollLeft = scrollPosition.x + deltaX;
    containerRef.current.scrollTop = scrollPosition.y + deltaY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // O mesmo para eventos de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('[data-draggable="true"]')) {
      return;
    }
    
    setIsDragging(true);
    setStartPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setScrollPosition({
      x: containerRef.current?.scrollLeft || 0,
      y: containerRef.current?.scrollTop || 0,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // Calcular a diferença com a posição inicial
    const deltaX = startPosition.x - e.touches[0].clientX;
    const deltaY = startPosition.y - e.touches[0].clientY;
    
    // Aplicar a rolagem horizontal e vertical
    containerRef.current.scrollLeft = scrollPosition.x + deltaX;
    containerRef.current.scrollTop = scrollPosition.y + deltaY;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Funcionalidade para mover e duplicar cards
  const [moveCardDialogOpen, setMoveCardDialogOpen] = useState(false);
  const [cardToMove, setCardToMove] = useState<{cardId: string, columnId: string} | null>(null);
  const [moveAction, setMoveAction] = useState<'move' | 'duplicate'>('move');

  const handleMoveCardRequest = (cardId: string, columnId: string, action: 'move' | 'duplicate') => {
    setCardToMove({ cardId, columnId });
    setMoveAction(action);
    setMoveCardDialogOpen(true);
  };

  const handleMoveCard = (targetColumnId: string) => {
    if (!cardToMove) return;
    
    const { cardId, columnId } = cardToMove;
    
    // Find source column and card
    const sourceColumn = columns.find(col => col.id === columnId);
    if (!sourceColumn) return;
    
    const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;
    
    const card = sourceColumn.cards[cardIndex];
    
    // Update columns based on action type
    const updatedColumns = columns.map(col => {
      // Add card to target column
      if (col.id === targetColumnId) {
        return {
          ...col,
          cards: [...col.cards, { ...card, id: moveAction === 'duplicate' ? `${card.id}-copy-${Date.now()}` : card.id }]
        };
      }
      
      // If moving (not duplicating), remove from source column
      if (moveAction === 'move' && col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter((_, i) => i !== cardIndex)
        };
      }
      
      return col;
    });
    
    setColumns(updatedColumns);
    setMoveCardDialogOpen(false);
    setCardToMove(null);
    
    const actionText = moveAction === 'move' ? 'movido' : 'duplicado';
    toast({
      title: `Card ${actionText}`,
      description: `O card foi ${actionText} com sucesso.`,
      duration: 2000,
    });
  };

  // Filtrar colunas com base no responsável
  const filteredColumns = filterColumnsByAssignee(columns, filterByAssignee);

  // Calcular largura responsiva da coluna
  const columnWidth = getResponsiveColumnWidth(filteredColumns, zoomLevel, isExpanded);
  
  // Calcular altura do container
  const containerHeight = getContainerHeight(isExpanded);

  // Otimizar renderização
  useEffect(() => {
    // Forçar um refresh do quadro quando o componente é montado
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Técnica para forçar um reflow
        containerRef.current.style.opacity = '0.99';
        setTimeout(() => {
          if (containerRef.current) containerRef.current.style.opacity = '1';
        }, 10);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

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

      <div 
        ref={containerRef}
        className="kanban-container overflow-x-auto overflow-y-auto pb-4"
        style={{ 
          height: containerHeight,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: isDragging ? 'none' : 'auto',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
          onMoveCard={handleMoveCardRequest}
        />
      </div>

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

      {/* Move/Duplicate Card Dialog */}
      <KanbanColumnDialog 
        isOpen={moveCardDialogOpen}
        onOpenChange={setMoveCardDialogOpen}
        title={moveAction === 'move' ? "Mover Card" : "Duplicar Card"}
        targetColumns={columns.filter(col => !cardToMove || col.id !== cardToMove.columnId)}
        onSelectColumn={handleMoveCard}
      />
    </div>
  );
};

export default KanbanBoard;
