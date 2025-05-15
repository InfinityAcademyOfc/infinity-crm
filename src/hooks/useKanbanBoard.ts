
import { useState } from "react";
import { KanbanCardItem, KanbanColumnItem } from "@/components/kanban/types";
import { useToast } from "@/hooks/use-toast";

export function useKanbanBoard(
  initialColumns: KanbanColumnItem[],
  onColumnUpdate?: (columns: KanbanColumnItem[]) => void
) {
  const { toast } = useToast();
  const [activeCard, setActiveCard] = useState<KanbanCardItem | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.75);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("bg-gray-200 dark:bg-gray-700");
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumnItem | null>(null);
  const [filterByAssignee, setFilterByAssignee] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const increaseZoom = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2));
  };

  const decreaseZoom = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const handleDragStart = (card: KanbanCardItem, columnId: string) => {
    setActiveCard(card);
    setActiveColumn(columnId);
  };

  const handleDrop = (
    e: React.DragEvent, 
    targetColumnId: string, 
    columns: KanbanColumnItem[], 
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    e.preventDefault();
    
    if (!activeCard || !activeColumn) return;
    
    // Remove the card from the source column
    const updatedColumns = columns.map(col => {
      if (col.id === activeColumn) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== activeCard.id)
        };
      }
      return col;
    });
    
    // Add the card to the target column
    const newColumns = updatedColumns.map(col => {
      if (col.id === targetColumnId) {
        return {
          ...col,
          cards: [...col.cards, activeCard]
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    if (onColumnUpdate) {
      onColumnUpdate(newColumns);
    }
    
    // Show a toast notification for the move
    const sourceColumn = columns.find(col => col.id === activeColumn);
    const targetColumn = columns.find(col => col.id === targetColumnId);
    
    if (sourceColumn && targetColumn && sourceColumn.id !== targetColumn.id) {
      toast({
        title: "Card movido com sucesso",
        description: `${activeCard.title} movido de ${sourceColumn.title} para ${targetColumn.title}`,
      });
    }
    
    setActiveCard(null);
    setActiveColumn(null);
  };

  const handleAddColumn = (
    columns: KanbanColumnItem[], 
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    if (!newColumnTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título da coluna não pode estar vazio",
        variant: "destructive"
      });
      return;
    }
    
    const newColumn: KanbanColumnItem = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
      cards: [],
      color: newColumnColor
    };
    
    setColumns([...columns, newColumn]);
    setNewColumnTitle("");
    setNewColumnColor("bg-gray-200 dark:bg-gray-700");
    setIsAddColumnOpen(false);
    
    toast({
      title: "Coluna adicionada",
      description: `A coluna ${newColumnTitle} foi adicionada com sucesso`
    });
  };
  
  const handleDeleteColumn = (
    columnId: string, 
    columns: KanbanColumnItem[], 
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    if (column.cards.length > 0) {
      toast({
        title: "Erro",
        description: "Não é possível excluir uma coluna que contém cartões",
        variant: "destructive"
      });
      return;
    }
    
    setColumns(columns.filter(col => col.id !== columnId));
    
    toast({
      title: "Coluna removida",
      description: `A coluna ${column.title} foi removida com sucesso`
    });
  };
  
  const openEditColumn = (column: KanbanColumnItem) => {
    setSelectedColumn(column);
    setNewColumnTitle(column.title);
    setNewColumnColor(column.color || "bg-gray-200 dark:bg-gray-700");
    setIsEditColumnOpen(true);
  };
  
  const handleEditColumn = (
    columns: KanbanColumnItem[], 
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    if (!selectedColumn) return;
    
    if (!newColumnTitle.trim()) {
      toast({
        title: "Erro",
        description: "O título da coluna não pode estar vazio",
        variant: "destructive"
      });
      return;
    }
    
    const updatedColumns = columns.map(col => {
      if (col.id === selectedColumn.id) {
        return {
          ...col,
          title: newColumnTitle,
          color: newColumnColor
        };
      }
      return col;
    });
    
    setColumns(updatedColumns);
    setIsEditColumnOpen(false);
    
    toast({
      title: "Coluna atualizada",
      description: `A coluna foi atualizada com sucesso`
    });
  };

  return {
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
  };
}
