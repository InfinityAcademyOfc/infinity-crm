
import React from "react";
import { useState } from "react";
import { FunnelHeader } from "@/components/sales-funnel/FunnelHeader";
import { FunnelAnalytics } from "@/components/sales-funnel/FunnelAnalytics";
import NewLeadDialog from "@/components/sales-funnel/NewLeadDialog";
import { EditLeadDialog } from "@/components/sales-funnel/EditLeadDialog";
import { SalesFunnelBoard } from "@/components/sales-funnel/SalesFunnelBoard";
import { useSalesFunnel } from "@/hooks/useSalesFunnel";
import { KanbanColumnItem } from "@/components/kanban/types";
import { useToast } from "@/hooks/use-toast";

// Mock data for initial columns
const mockKanbanColumns: KanbanColumnItem[] = [
  {
    id: "new_lead",
    title: "Novo Lead",
    cards: []
  },
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

const SalesFunnel = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const { toast } = useToast();

  const {
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
  } = useSalesFunnel(mockKanbanColumns);

  // Handler for when filters are applied
  const handleFiltersApplied = () => {
    // When filters are applied, automatically show analytics
    setShowAnalytics(true);
    setFilterMenuOpen(false);
  };
  
  // Handle the export functionality
  const handleExport = () => {
    // Get all data from columns
    let allCards = [];
    for (const col of columns) {
      allCards = [...allCards, ...col.cards.map(card => ({
        etapa: col.title,
        ...card
      }))];
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers (assuming cards have these properties)
    csvContent += "Etapa,Título,Descrição,Valor,Prioridade,Responsável,Data\n";
    
    // Add data rows
    allCards.forEach(card => {
      csvContent += `"${card.etapa || ''}","${card.title || ''}","${card.description || ''}",${card.value || 0},"${card.priority || ''}","${card.assignedTo?.name || ''}","${card.dueDate || ''}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `funil-vendas-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Download CSV file
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados do funil de vendas foram exportados com sucesso para CSV.",
      duration: 2000
    });
  };

  return (
    <div className="space-y-4 bg-background text-foreground transition-colors duration-300">
      <div className="flex justify-end items-center">
        <FunnelHeader 
          showAnalytics={showAnalytics} 
          setShowAnalytics={setShowAnalytics} 
          filterMenuOpen={filterMenuOpen} 
          setFilterMenuOpen={setFilterMenuOpen} 
          onAddNewLead={handleAddNewLead}
          onFiltersApplied={handleFiltersApplied}
          onExport={handleExport}
        />
      </div>
      
      {showAnalytics && <FunnelAnalytics funnelStageData={funnelStageData} valuePotentialData={valuePotentialData} />}
      
      <SalesFunnelBoard columns={columns} setColumns={setColumns} onAddCard={handleAddCard} onEditCard={handleEditCard} onDeleteCard={handleDeleteCard} />
      
      <NewLeadDialog open={newCardOpen} onOpenChange={setNewCardOpen} activeColumnId={activeColumnId} onSave={handleSaveNewLead} />
      
      <EditLeadDialog open={editCardOpen} onOpenChange={setEditCardOpen} activeCard={activeCard} onUpdate={handleUpdateCard} />
    </div>
  );
};

export default SalesFunnel;
