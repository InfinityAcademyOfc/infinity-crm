
import { useState, useCallback, useEffect } from 'react';
import { KanbanCardItem, KanbanColumnItem } from '@/components/kanban/types';
import { useAuth } from '@/contexts/AuthContext';
import { kanbanPersistenceService } from '@/services/kanbanPersistenceService';

export function useKanbanBoard(
  initialColumns: KanbanColumnItem[] = [],
  onColumnUpdate?: (columns: KanbanColumnItem[]) => void,
  kanbanType: 'sales' | 'production' | 'clients' = 'sales'
) {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(initialColumns);
  const [activeCard, setActiveCard] = useState<KanbanCardItem | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('#4f46e5');
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumnItem | null>(null);
  const [filterByAssignee, setFilterByAssignee] = useState('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const { user, company } = useAuth();

  // Carregar estado salvo do kanban
  useEffect(() => {
    const loadSavedState = async () => {
      if (!user?.id || !company?.id) return;

      try {
        const savedState = await kanbanPersistenceService.loadKanbanState(
          user.id,
          company.id,
          kanbanType
        );

        if (savedState) {
          setColumns(savedState);
        }
      } catch (error) {
        console.error('Erro ao carregar estado do kanban:', error);
      }
    };

    loadSavedState();
  }, [user?.id, company?.id, kanbanType]);

  // Configurar salvamento automático
  useEffect(() => {
    if (!user?.id || !company?.id) return;

    // Salvar o estado atual quando as colunas mudam
    const saveCurrentState = () => {
      try {
        kanbanPersistenceService.saveKanbanState(
          user.id,
          company.id,
          kanbanType,
          columns
        );
      } catch (error) {
        console.error('Erro ao salvar estado do kanban:', error);
      }
    };

    // Debounce para não salvar a cada pequena alteração
    const debounceTimeout = setTimeout(saveCurrentState, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [columns, user?.id, company?.id, kanbanType]);

  const increaseZoom = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const decreaseZoom = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const toggleExpand = () => setIsExpanded(prev => !prev);

  const handleDragStart = useCallback((card: KanbanCardItem, columnId: string) => {
    setActiveCard(card);
    setActiveColumn(columnId);
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent,
    targetColumnId: string,
    columns: KanbanColumnItem[],
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    e.preventDefault();
    
    if (!activeCard || !activeColumn) return;

    const updatedColumns = columns.map(column => {
      // Remove da coluna original
      if (column.id === activeColumn) {
        return {
          ...column,
          cards: column.cards.filter(card => card.id !== activeCard.id)
        };
      }
      
      // Adiciona na nova coluna
      if (column.id === targetColumnId) {
        return {
          ...column,
          cards: [...column.cards, { ...activeCard, status: targetColumnId }]
        };
      }
      
      return column;
    });
    
    setColumns(updatedColumns);
    
    if (onColumnUpdate) {
      onColumnUpdate(updatedColumns);
    }
    
    setActiveCard(null);
    setActiveColumn(null);
  }, [activeCard, activeColumn, onColumnUpdate]);

  const handleAddColumn = useCallback((
    columns: KanbanColumnItem[],
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    if (!newColumnTitle) return;
    
    const newColumn: KanbanColumnItem = {
      id: `col_${Date.now()}`,
      title: newColumnTitle,
      color: newColumnColor,
      cards: []
    };
    
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    
    if (onColumnUpdate) {
      onColumnUpdate(updatedColumns);
    }
    
    setNewColumnTitle('');
    setNewColumnColor('#4f46e5');
    setIsAddColumnOpen(false);
  }, [newColumnTitle, newColumnColor, onColumnUpdate]);

  const handleDeleteColumn = useCallback((
    columnId: string,
    columns: KanbanColumnItem[],
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    const updatedColumns = columns.filter(col => col.id !== columnId);
    setColumns(updatedColumns);
    
    if (onColumnUpdate) {
      onColumnUpdate(updatedColumns);
    }
  }, [onColumnUpdate]);

  const openEditColumn = useCallback((column: KanbanColumnItem) => {
    setSelectedColumn(column);
    setNewColumnTitle(column.title);
    setNewColumnColor(column.color || '#4f46e5');
    setIsEditColumnOpen(true);
  }, []);

  const handleEditColumn = useCallback((
    columns: KanbanColumnItem[],
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    if (!selectedColumn || !newColumnTitle) return;
    
    const updatedColumns = columns.map(col => 
      col.id === selectedColumn.id 
        ? { ...col, title: newColumnTitle, color: newColumnColor }
        : col
    );
    
    setColumns(updatedColumns);
    
    if (onColumnUpdate) {
      onColumnUpdate(updatedColumns);
    }
    
    setSelectedColumn(null);
    setNewColumnTitle('');
    setNewColumnColor('#4f46e5');
    setIsEditColumnOpen(false);
  }, [selectedColumn, newColumnTitle, newColumnColor, onColumnUpdate]);

  return {
    columns,
    setColumns,
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
