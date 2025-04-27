
import { useState } from "react";
import { KanbanCardItem, KanbanColumnItem } from "@/components/kanban/types";
import { useToast } from "@/hooks/use-toast";

// Default columns in case none are provided
const defaultColumns: KanbanColumnItem[] = [
  {
    id: "prospecting",
    title: "Prospecção",
    cards: []
  },
  {
    id: "qualification",
    title: "Qualificação",
    cards: []
  },
  {
    id: "proposal",
    title: "Proposta",
    cards: []
  },
  {
    id: "negotiation",
    title: "Negociação",
    cards: []
  },
  {
    id: "closed_won",
    title: "Ganhos",
    cards: []
  }
];

export function useSalesFunnel(initialColumns: KanbanColumnItem[] = defaultColumns) {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(initialColumns);
  const [newCardOpen, setNewCardOpen] = useState(false);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<KanbanCardItem | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setNewCardOpen(true);
  };

  const handleAddNewLead = () => {
    setActiveColumnId("prospecting");
    setNewCardOpen(true);
  };

  const handleSaveNewLead = (data: any) => {
    if (!activeColumnId) return;
    
    const newCard: KanbanCardItem = {
      id: Date.now().toString(),
      ...data
    };
    
    const newColumns = columns.map(col => {
      if (col.id === activeColumnId) {
        return {
          ...col,
          cards: [...col.cards, newCard]
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    setNewCardOpen(false);
    
    toast({
      title: "Lead adicionado com sucesso",
      description: `${data.title} foi adicionado à etapa ${columns.find(col => col.id === activeColumnId)?.title}`,
      duration: 2000,
    });
  };

  const handleEditCard = (cardId: string, columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    const card = column.cards.find(card => card.id === cardId);
    if (!card) return;
    
    setActiveCard(card);
    setActiveColumnId(columnId);
    setEditCardOpen(true);
  };

  const handleUpdateCard = (updatedCard: KanbanCardItem) => {
    if (!activeColumnId) return;
    
    const newColumns = columns.map(col => {
      if (col.id === activeColumnId) {
        return {
          ...col,
          cards: col.cards.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          )
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    setEditCardOpen(false);
    
    toast({
      title: "Lead atualizado com sucesso",
      description: `As informações de ${updatedCard.title} foram atualizadas`,
      duration: 2000,
    });
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    const card = column.cards.find(card => card.id === cardId);
    if (!card) return;
    
    const newColumns = columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          cards: col.cards.filter(card => card.id !== cardId)
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    
    toast({
      title: "Lead removido",
      description: `${card.title} foi removido do funil`,
      duration: 2000,
    });
  };

  // Prepare data for analytics charts
  const funnelStageData = columns.map(column => ({
    name: column.title,
    value: column.cards.length
  }));
  
  const valuePotentialData = columns.map(column => ({
    name: column.title,
    value: column.cards.reduce((sum, card) => sum + (card.value || 0), 0)
  }));

  return {
    columns,
    setColumns,
    newCardOpen,
    setNewCardOpen,
    editCardOpen,
    setEditCardOpen,
    activeCard,
    activeColumnId,
    funnelStageData,
    valuePotentialData,
    handleAddCard,
    handleAddNewLead,
    handleSaveNewLead,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard
  };
}
