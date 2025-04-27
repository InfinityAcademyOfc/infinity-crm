
import React, { useState } from "react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { KanbanColumnItem } from "@/components/kanban/types";
import { SectionHeader } from "@/components/ui/section-header";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialColumns: KanbanColumnItem[] = [{
  id: "ltv-new",
  title: "Novos Clientes",
  cards: [{
    id: "ltv-card-1",
    title: "Empresa ABC",
    description: "Primeiro contrato de serviços",
    tags: [{
      label: "Tecnologia",
      color: "bg-blue-100 text-blue-800"
    }, {
      label: "SaaS",
      color: "bg-green-100 text-green-800"
    }],
    metadata: {
      value: "R$ 2.500,00",
      assignee: "Carlos Silva",
      date: "10/04/2023"
    }
  }, {
    id: "ltv-card-2",
    title: "Startup XYZ",
    description: "Desenvolvimento de software",
    tags: [{
      label: "Startup",
      color: "bg-purple-100 text-purple-800"
    }, {
      label: "Desenvolvimento",
      color: "bg-cyan-100 text-cyan-800"
    }],
    metadata: {
      value: "R$ 8.000,00",
      assignee: "Ana Oliveira",
      date: "15/04/2023"
    }
  }]
}, {
  id: "ltv-active",
  title: "Clientes Ativos",
  cards: [{
    id: "ltv-card-3",
    title: "Consultoria ABC",
    description: "Renovação de contrato mensal",
    tags: [{
      label: "Consultoria",
      color: "bg-yellow-100 text-yellow-800"
    }, {
      label: "Recorrente",
      color: "bg-orange-100 text-orange-800"
    }],
    metadata: {
      value: "R$ 5.000,00/mês",
      assignee: "Marcos Souza",
      date: "Desde 01/01/2023"
    }
  }, {
    id: "ltv-card-4",
    title: "Indústria ACME",
    description: "Contrato de manutenção",
    tags: [{
      label: "Indústria",
      color: "bg-blue-100 text-blue-800"
    }, {
      label: "B2B",
      color: "bg-green-100 text-green-800"
    }],
    metadata: {
      value: "R$ 12.000,00/mês",
      assignee: "Paula Andrade",
      date: "Desde 15/02/2023"
    }
  }]
}, {
  id: "ltv-growth",
  title: "Clientes em Crescimento",
  cards: [{
    id: "ltv-card-5",
    title: "TechSoft",
    description: "Expansão de serviços para novas áreas",
    tags: [{
      label: "Tecnologia",
      color: "bg-blue-100 text-blue-800"
    }, {
      label: "Expansão",
      color: "bg-purple-100 text-purple-800"
    }],
    metadata: {
      value: "R$ 15.000,00/mês",
      assignee: "Roberto Alves",
      date: "Cliente desde 2022"
    }
  }]
}, {
  id: "ltv-loyalty",
  title: "Clientes Fiéis",
  cards: [{
    id: "ltv-card-6",
    title: "Global Shop",
    description: "Parceiro estratégico há 5 anos",
    tags: [{
      label: "Varejo",
      color: "bg-pink-100 text-pink-800"
    }, {
      label: "Parceria",
      color: "bg-indigo-100 text-indigo-800"
    }],
    metadata: {
      value: "R$ 250.000,00/ano",
      assignee: "Joana Lima",
      date: "Cliente desde 2019"
    }
  }]
}, {
  id: "ltv-advocate",
  title: "Advogados da Marca",
  cards: [{
    id: "ltv-card-7",
    title: "Mega Corp",
    description: "Indicações frequentes, participação em cases",
    tags: [{
      label: "Corporativo",
      color: "bg-gray-100 text-gray-800"
    }, {
      label: "Indicações",
      color: "bg-amber-100 text-amber-800"
    }],
    metadata: {
      value: "R$ 500.000,00/ano",
      assignee: "Felipe Costa",
      date: "Cliente desde 2018"
    }
  }]
}];

const ClientLtvFunnel = () => {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(initialColumns);
  const { toast } = useToast();

  // Function to export data
  const handleExport = () => {
    // Prepare CSV content
    const headers = ["Etapa", "Cliente", "Descrição", "Valor", "Responsável", "Data"];
    const rows = columns.flatMap(column => 
      column.cards.map(card => [
        column.title,
        card.title,
        card.description || "",
        card.metadata?.value || "",
        card.metadata?.assignee || "",
        card.metadata?.date || ""
      ])
    );
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ltv-funnel-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados do funil LTV foram exportados em formato CSV",
      duration: 2000
    });
  };

  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SectionHeader title="Funil de Valor do Cliente (LTV)" description="Visualize e gerencie o ciclo de vida e valor de seus clientes" />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-2"
          onClick={handleExport}
        >
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <KanbanBoard columns={columns} setColumns={setColumns} />
      </div>
    </div>;
};

export default ClientLtvFunnel;
