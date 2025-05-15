
import React from "react";
import { useState } from "react";
import { FunnelHeader } from "@/components/sales-funnel/FunnelHeader";
import { FunnelAnalytics } from "@/components/sales-funnel/FunnelAnalytics";
import NewLeadDialog from "@/components/sales-funnel/NewLeadDialog";
import { EditLeadDialog } from "@/components/sales-funnel/EditLeadDialog";
import { SalesFunnelBoard } from "@/components/sales-funnel/SalesFunnelBoard";
import { useSalesFunnel } from "@/hooks/useSalesFunnel";
import { KanbanColumnItem } from "@/components/kanban/types";

// Mock data for initial columns
const mockKanbanColumns: KanbanColumnItem[] = [
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
