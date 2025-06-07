
import { useState } from "react";
import ProductionTabs from "@/components/production/ProductionTabs";
import { KanbanColumnItem, KanbanCardItem } from "@/components/kanban/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Download, Plus, RefreshCw } from "lucide-react";
import { useModuleSync } from "@/services/moduleSyncService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductionManagement = () => {
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

  const [columns, setColumns] = useState<KanbanColumnItem[]>(mockTasksKanbanColumns);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    client: "",
    priority: "medium" as "low" | "medium" | "high",
    startDate: "",
    endDate: "",
    assignee: "user-1"
  });

  const {
    syncAllModules,
    isSyncing
  } = useModuleSync();
  const {
    toast
  } = useToast();

  const handleSyncModules = () => {
    syncAllModules();
    toast({
      title: "Sincronização iniciada",
      description: "Sincronizando dados entre todos os módulos..."
    });
  };

  const handleNewTaskChange = (field: string, value: string) => {
    setNewTask({
      ...newTask,
      [field]: value
    });
  };

  const handleCreateTask = () => {
    if (!newTask.title) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório",
        variant: "destructive"
      });
      return;
    }

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

    const assignedUser = users.find(user => user.id === newTask.assignee) || users[0];

    const newTaskItem: KanbanCardItem = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      client: newTask.client,
      assignedTo: assignedUser,
      priority: newTask.priority,
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
    setIsNewTaskDialogOpen(false);
    setNewTask({
      title: "",
      description: "",
      client: "",
      priority: "medium" as "low" | "medium" | "high",
      startDate: "",
      endDate: "",
      assignee: "user-1"
    });
    toast({
      title: "Tarefa criada",
      description: "A tarefa foi adicionada ao backlog e ao gráfico Gantt"
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="p-2 sm:p-4 backdrop-blur-md shadow-md border border-border/40 bg-transparent">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
              <Filter size={14} />
              <span className="text-xs">Filtrar</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
              <Download size={14} />
              <span className="text-xs">Exportar</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 h-8" onClick={handleSyncModules} disabled={isSyncing}>
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              <span className="text-xs">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
            </Button>
            <Button size="sm" className="flex items-center gap-1 h-8" onClick={() => setIsNewTaskDialogOpen(true)}>
              <Plus size={14} />
              <span className="text-xs">Nova Tarefa</span>
            </Button>
          </div>
        </div>
      </Card>
      
      <ProductionTabs columns={columns} setColumns={setColumns} />
      
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>
              Crie uma nova tarefa para adicionar ao kanban e gráfico Gantt
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={newTask.title} onChange={e => handleNewTaskChange("title", e.target.value)} placeholder="Título da tarefa" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" value={newTask.description} onChange={e => handleNewTaskChange("description", e.target.value)} placeholder="Descrição detalhada da tarefa" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Cliente</Label>
                <Input id="client" value={newTask.client} onChange={e => handleNewTaskChange("client", e.target.value)} placeholder="Nome do cliente" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={newTask.priority} onValueChange={(value: "low" | "medium" | "high") => handleNewTaskChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input id="startDate" type="date" value={newTask.startDate} onChange={e => handleNewTaskChange("startDate", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input id="endDate" type="date" value={newTask.endDate} onChange={e => handleNewTaskChange("endDate", e.target.value)} />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assignee">Responsável</Label>
              <Select value={newTask.assignee} onValueChange={value => handleNewTaskChange("assignee", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-1">Carlos Silva</SelectItem>
                  <SelectItem value="user-2">Ana Oliveira</SelectItem>
                  <SelectItem value="user-3">Miguel Santos</SelectItem>
                  <SelectItem value="user-4">Julia Costa</SelectItem>
                  <SelectItem value="user-5">Roberto Alves</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateTask}>Criar Tarefa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionManagement;
