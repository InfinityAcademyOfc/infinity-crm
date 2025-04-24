import React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FunnelHeader } from "@/components/sales-funnel/FunnelHeader";
import { FunnelAnalytics } from "@/components/sales-funnel/FunnelAnalytics";
import { NewLeadDialog } from "@/components/sales-funnel/NewLeadDialog";
import { EditLeadDialog } from "@/components/sales-funnel/EditLeadDialog";
import { SalesFunnelBoard } from "@/components/sales-funnel/SalesFunnelBoard";
import { useSalesFunnel } from "@/hooks/useSalesFunnel";
import { KanbanColumnItem } from "@/components/kanban/types";

const SalesFunnel = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Mock data with correct assignedTo property structure
  const mockKanbanColumns: KanbanColumnItem[] = [{
    id: "prospecting",
    title: "Prospecção",
    color: "bg-gray-200 dark:bg-gray-700",
    cards: [{
      id: "lead-1",
      title: "Empresa ABC",
      description: "Interessados em CRM para equipe de vendas",
      value: 5000,
      assignedTo: {
        id: "user-1",
        name: "Carlos Silva",
        avatar: "/placeholder.svg"
      },
      dueDate: "2023-05-15",
      priority: "high",
      tags: [{
        label: "CRM",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      }]
    }, {
      id: "lead-2",
      title: "Startup XYZ",
      description: "Procurando solução de automação de marketing",
      value: 3500,
      assignedTo: {
        id: "user-2",
        name: "Ana Oliveira",
        avatar: "/placeholder.svg"
      },
      dueDate: "2023-05-20",
      priority: "medium",
      tags: [{
        label: "Marketing",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      }]
    }]
  }, {
    id: "qualification",
    title: "Qualificação",
    color: "bg-blue-200 dark:bg-blue-900",
    cards: [{
      id: "lead-3",
      title: "Consultoria 123",
      description: "Precisam de sistema para gestão de projetos",
      value: 7500,
      assignedTo: {
        id: "user-3",
        name: "Pedro Santos",
        avatar: "/placeholder.svg"
      },
      dueDate: "2023-05-25",
      priority: "high",
      tags: [{
        label: "Projetos",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      }]
    }]
  }, {
    id: "proposal",
    title: "Proposta",
    color: "bg-yellow-200 dark:bg-yellow-900",
    cards: [{
      id: "lead-4",
      title: "Tech Solutions",
      description: "Avaliando proposta de consultoria de TI",
      value: 12000,
      assignedTo: {
        id: "user-4",
        name: "Mariana Costa",
        avatar: "/placeholder.svg"
      },
      dueDate: "2023-06-05",
      priority: "medium",
      tags: [{
        label: "Consultoria",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      }]
    }]
  }, {
    id: "negotiation",
    title: "Negociação",
    color: "bg-orange-200 dark:bg-orange-900",
    cards: [{
      id: "lead-5",
      title: "Global Corp",
      description: "Fechando detalhes do contrato anual",
      value: 48000,
      assignedTo: {
        id: "user-5",
        name: "Rafael Almeida",
        avatar: "/placeholder.svg"
      },
      dueDate: "2023-06-15",
      priority: "high",
      tags: [{
        label: "Contrato",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      }]
    }]
  }, {
    id: "closed",
    title: "Fechado",
    color: "bg-green-200 dark:bg-green-900",
    cards: [{
      id: "lead-6",
      title: "Mega Industries",
      description: "Contrato de suporte técnico assinado",
      value: 24000,
      assignedTo: {
        id: "user-6",
        name: "Juliana Lima",
        avatar: "/placeholder.svg"
      },
      dueDate: "2023-06-01",
      priority: "low",
      tags: [{
        label: "Suporte",
        color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
      }]
    }]
  }];

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
    handleSaveNewCard,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard
  } = useSalesFunnel(mockKanbanColumns);

  return (
    <div className="space-y-6 bg-background text-foreground transition-colors duration-300">
      <div className="flex justify-between items-center">
        <FunnelHeader showAnalytics={showAnalytics} setShowAnalytics={setShowAnalytics} filterMenuOpen={filterMenuOpen} setFilterMenuOpen={setFilterMenuOpen} onAddNewLead={handleAddNewLead} />
      </div>
      
      {showAnalytics && <FunnelAnalytics funnelStageData={funnelStageData} valuePotentialData={valuePotentialData} />}
      
      <SalesFunnelBoard columns={columns} setColumns={setColumns} onAddCard={handleAddCard} onEditCard={handleEditCard} onDeleteCard={handleDeleteCard} />
      
      <NewLeadDialog open={newCardOpen} onOpenChange={setNewCardOpen} activeColumnId={activeColumnId} onSave={handleSaveNewCard} />
      
      <EditLeadDialog open={editCardOpen} onOpenChange={setEditCardOpen} activeCard={activeCard} onUpdate={handleUpdateCard} />
    </div>
  );
};

export default SalesFunnel;
