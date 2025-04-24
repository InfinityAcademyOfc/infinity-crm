
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeColumnId: string | null;
  onSave: (data: any) => void;
}

export function NewLeadDialog({
  open,
  onOpenChange,
  activeColumnId,
  onSave,
}: NewLeadDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [assignee, setAssignee] = useState("");
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<{text: string, completed: boolean}[]>([]);

  const mockTeamMembers = [
    { id: "user-1", name: "Carlos Silva" },
    { id: "user-2", name: "Ana Oliveira" },
    { id: "user-3", name: "Miguel Santos" },
    { id: "user-4", name: "Julia Costa" },
    { id: "user-5", name: "Roberto Alves" },
  ];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setValue("");
    setDueDate("");
    setPriority("medium");
    setPhone("");
    setEmail("");
    setWebsite("");
    setSocialMedia("");
    setAssignee("");
    setChecklistItems([]);
    setNewTask("");
    setTasks([]);
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, {text: newTask, completed: false}]);
    setNewTask("");
  };

  const toggleTask = (index: number) => {
    setTasks(tasks.map((task, i) => 
      i === index ? {...task, completed: !task.completed} : task
    ));
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title) {
      toast.error("O título do lead é obrigatório");
      return;
    }
    
    if (!assignee) {
      toast.error("É necessário atribuir um responsável");
      return;
    }

    // Format the value as a number
    const formattedValue = value ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : 0;

    const selectedAssignee = mockTeamMembers.find(member => member.id === assignee);

    onSave({
      title,
      description,
      value: formattedValue,
      dueDate,
      priority,
      phone,
      email,
      website,
      socialMedia,
      tasks,
      assignedTo: selectedAssignee ? {
        id: selectedAssignee.id,
        name: selectedAssignee.name,
        avatar: "/placeholder.svg",
      } : null,
    });

    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da Empresa/Cliente *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Empresa ABC"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Valor Potencial</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ex: 5000"
                type="text"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre o lead..."
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
                type="email"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social">Rede Social</Label>
              <Input
                id="social"
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value)}
                placeholder="@empresa"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data Prevista</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
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
          
          <div className="space-y-2">
            <Label htmlFor="assignee">Responsável *</Label>
            <Select value={assignee} onValueChange={setAssignee} required>
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Atribuir para..." />
              </SelectTrigger>
              <SelectContent>
                {mockTeamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Tarefas</Label>
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nova tarefa..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTask} size="sm">
                Adicionar
              </Button>
            </div>
            
            {tasks.length > 0 && (
              <Card className="mt-2">
                <CardContent className="p-2">
                  <ul className="space-y-2">
                    {tasks.map((task, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Checkbox 
                          id={`task-${index}`} 
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(index)}
                        />
                        <label 
                          htmlFor={`task-${index}`}
                          className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.text}
                        </label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={() => handleRemoveTask(index)}
                        >
                          &times;
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
