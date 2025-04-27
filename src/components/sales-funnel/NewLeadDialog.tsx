
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeColumnId: string | null;
  onSave: (data: {
    title: string;
    description: string;
    value: number;
    priority: string;
    dueDate: string;
    assignedTo: {
      id: string;
      name: string;
      avatar: string;
    };
    tags: Array<{
      label: string;
      color: string;
    }>;
  }) => void;
}

const NewLeadDialog = ({
  open,
  onOpenChange,
  activeColumnId,
  onSave,
}: NewLeadDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState<Date>();
  const [assignee, setAssignee] = useState("");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState("bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300");
  const [tags, setTags] = useState<Array<{ label: string; color: string }>>([]);
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setValue("");
    setPriority("medium");
    setDueDate(undefined);
    setAssignee("");
    setTag("");
    setTagColor("bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300");
    setTags([]);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };
  
  const handleSave = () => {
    const valueNumber = parseFloat(value.replace(/\./g, "").replace(",", "."));
    
    if (!title || isNaN(valueNumber) || !assignee) {
      return;
    }
    
    onSave({
      title,
      description,
      value: valueNumber,
      priority,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      assignedTo: {
        id: assignee === "user-1" ? "user-1" : assignee === "user-2" ? "user-2" : "user-3",
        name: assignee === "user-1" ? "Carlos Silva" : assignee === "user-2" ? "Ana Oliveira" : "Pedro Santos",
        avatar: "/placeholder.svg"
      },
      tags,
    });
    
    handleClose();
  };
  
  const handleAddTag = () => {
    if (tag && !tags.some((t) => t.label === tag)) {
      setTags([...tags, { label: tag, color: tagColor }]);
      setTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t.label !== tagToRemove));
  };
  
  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/\D/g, "");
    numericValue = numericValue.replace(/(\d)(\d{2})$/, "$1,$2");
    numericValue = numericValue.replace(/(?=(\d{3})+(\D))\B/g, ".");
    
    return numericValue ? `R$ ${numericValue}` : "";
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-2">
            <Label htmlFor="title">Nome / Empresa*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da empresa ou cliente"
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre o lead"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="value">Valor*</Label>
              <Input
                id="value"
                value={formatCurrency(value)}
                onChange={(e) => setValue(e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecionar prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Data de validade</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    {dueDate ? format(dueDate, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="assignee">Responsável*</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-1">Carlos Silva</SelectItem>
                  <SelectItem value="user-2">Ana Oliveira</SelectItem>
                  <SelectItem value="user-3">Pedro Santos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <Badge key={t.label} className={`${t.color} flex items-center gap-1`}>
                  {t.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t.label)}
                    className="ml-1 rounded-full hover:bg-background/20 p-1"
                  >
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Nova tag"
                className="flex-grow"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Select value={tagColor} onValueChange={setTagColor}>
                <SelectTrigger className="w-[120px] flex-shrink-0">
                  <SelectValue placeholder="Cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Azul
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Verde
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      Vermelho
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      Amarelo
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      Roxo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeadDialog;
