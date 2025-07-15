
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { KanbanColumnItem, KanbanCardItem } from "@/components/kanban/types";

export const useProductionManagement = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  
  const [columns, setColumns] = useState<KanbanColumnItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const mockTasksKanbanColumns: KanbanColumnItem[] = [{
    id: "backlog",
    title: "Backlog",
    color: "bg-gray-200 dark:bg-gray-700",
    cards: [{
      id: "task-1",
      title: "Criar landing page",
      description: "Desenvolver nova landing page para campanha de marketing",
      client: "ABC Corp",
      assignedTo: {
        id: "user-1",
        name: "Carlos Silva",
        avatar: "/placeholder.svg"
      },
      priority: "high",
      completion: 0
    }, {
      id: "task-2",
      title: "Revisar design do app",
      description: "Fazer revisão do design do aplicativo móvel",
      client: "XYZ Ltda",
      assignedTo: {
        id: "user-2",
        name: "Ana Oliveira",
        avatar: "/placeholder.svg"
      },
      priority: "medium",
      completion: 0
    }]
  }, {
    id: "in-progress",
    title: "Em Progresso",
    color: "bg-blue-200 dark:bg-blue-900",
    cards: [{
      id: "task-3",
      title: "Implementar API de pagamentos",
      description: "Integrar gateway de pagamento no sistema de e-commerce",
      client: "Shop Online",
      assignedTo: {
        id: "user-3",
        name: "Miguel Santos",
        avatar: "/placeholder.svg"
      },
      priority: "high",
      completion: 45
    }]
  }, {
    id: "review",
    title: "Revisão",
    color: "bg-yellow-200 dark:bg-yellow-900",
    cards: [{
      id: "task-4",
      title: "Testar funcionalidade de login",
      description: "Realizar testes de usabilidade e segurança no login",
      client: "SecureTech",
      assignedTo: {
        id: "user-4",
        name: "Julia Costa",
        avatar: "/placeholder.svg"
      },
      priority: "medium",
      completion: 85
    }]
  }, {
    id: "done",
    title: "Concluído",
    color: "bg-green-200 dark:bg-green-900",
    cards: [{
      id: "task-5",
      title: "Criar identidade visual",
      description: "Desenvolver logo e identidade visual para novo cliente",
      client: "New Brand",
      assignedTo: {
        id: "user-5",
        name: "Roberto Alves",
        avatar: "/placeholder.svg"
      },
      priority: "low",
      completion: 100
    }]
  }];

  useEffect(() => {
    loadProductionData();
  }, [company]);

  const loadProductionData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setColumns(mockTasksKanbanColumns);
    } catch (error) {
      console.error('Erro ao carregar dados de produção:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de produção",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncModules = () => {
    setIsSyncing(true);
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sincronização concluída",
        description: "Dados sincronizados com sucesso!"
      });
    }, 2000);
    toast({
      title: "Sincronização iniciada",
      description: "Sincronizando dados entre todos os módulos..."
    });
  };

  const createNewTask = (taskData: {
    title: string;
    description: string;
    client: string;
    priority: "low" | "medium" | "high";
    assignee: string;
  }) => {
    const users = [{
      id: "user-1",
      name: "Carlos Silva",
      avatar: "/placeholder.svg"
    }, {
      id: "user-2",
      name: "Ana Oliveira",
      avatar: "/placeholder.svg"
    }, {
      id: "user-3",
      name: "Miguel Santos",
      avatar: "/placeholder.svg"
    }, {
      id: "user-4",
      name: "Julia Costa",
      avatar: "/placeholder.svg"
    }, {
      id: "user-5",
      name: "Roberto Alves",
      avatar: "/placeholder.svg"
    }];

    const assignedUser = users.find(user => user.id === taskData.assignee) || users[0];

    const newTaskItem: KanbanCardItem = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      client: taskData.client,
      assignedTo: assignedUser,
      priority: taskData.priority,
      completion: 0
    };

    const updatedColumns = columns.map(column => {
      if (column.id === "backlog") {
        return {
          ...column,
          cards: [...column.cards, newTaskItem]
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi adicionada ao backlog e ao gráfico Gantt"
    });

    return newTaskItem;
  };

  return {
    columns,
    setColumns,
    loading,
    isSyncing,
    handleSyncModules,
    createNewTask
  };
};
