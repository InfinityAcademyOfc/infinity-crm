
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (taskData: {
    title: string;
    description: string;
    client: string;
    priority: "low" | "medium" | "high";
    assignee: string;
  }) => void;
}

export const NewTaskDialog: React.FC<NewTaskDialogProps> = ({
  open,
  onOpenChange,
  onCreateTask
}) => {
  const { toast } = useToast();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    client: "",
    priority: "medium" as "low" | "medium" | "high",
    assignee: "user-1"
  });

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

    onCreateTask(newTask);
    
    // Reset form
    setNewTask({
      title: "",
      description: "",
      client: "",
      priority: "medium",
      assignee: "user-1"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Crie uma nova tarefa para o quadro de produção.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => handleNewTaskChange("title", e.target.value)}
              placeholder="Digite o título da tarefa"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => handleNewTaskChange("description", e.target.value)}
              placeholder="Descreva a tarefa"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Input
                id="client"
                value={newTask.client}
                onChange={(e) => handleNewTaskChange("client", e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select 
                value={newTask.priority} 
                onValueChange={(value) => handleNewTaskChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="assignee">Responsável</Label>
            <Select 
              value={newTask.assignee} 
              onValueChange={(value) => handleNewTaskChange("assignee", value)}
            >
              <SelectTrigger>
                <SelectValue />
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateTask}>
            Criar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
