
import { useState } from "react";
import { KanbanCardItem, KanbanColumnItem } from "@/components/kanban/types";
import { useToast } from "@/hooks/use-toast";

export function useSalesFunnel(initialColumns: KanbanColumnItem[]) {
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

  const handleSaveNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const value = parseFloat(formData.get("value") as string);
    const priority = formData.get("priority") as "low" | "medium" | "high";
    
    if (!title || !activeColumnId) return;
    
    const newCard: KanbanCardItem = {
      id: Date.now().toString(),
      title,
      description,
      value: isNaN(value) ? 0 : value,
      priority,
      tags: [
        { label: "Novo", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" }
      ],
      assignedTo: {
        id: "user-1",
        name: "Carlos Silva",
        avatar: "/placeholder.svg"
      },
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    form.reset();
    
    toast({
      title: "Lead adicionado com sucesso",
      description: `${title} foi adicionado à etapa ${columns.find(col => col.id === activeColumnId)?.title}`,
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

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard || !activeColumnId) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const value = parseFloat(formData.get("value") as string);
    const priority = formData.get("priority") as "low" | "medium" | "high";
    
    const updatedCard: KanbanCardItem = {
      ...activeCard,
      title,
      description,
      value: isNaN(value) ? 0 : value,
      priority,
    };
    
    const newColumns = columns.map(col => {
      if (col.id === activeColumnId) {
        return {
          ...col,
          cards: col.cards.map(card => 
            card.id === activeCard.id ? updatedCard : card
          )
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    setEditCardOpen(false);
    
    toast({
      title: "Lead atualizado com sucesso",
      description: `As informações de ${title} foram atualizadas`,
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
    handleSaveNewCard,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard
  };
}
