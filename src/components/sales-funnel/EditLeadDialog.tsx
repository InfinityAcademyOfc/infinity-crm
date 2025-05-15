
import { Share2, Tag, User, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KanbanCardItem } from "@/components/kanban/types";
import { FormEvent } from "react";

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCard: KanbanCardItem | null;
  onUpdate: (updatedCard: KanbanCardItem) => void;
}

export const EditLeadDialog = ({ 
  open, 
  onOpenChange, 
  activeCard, 
  onUpdate 
}: EditLeadDialogProps) => {
  if (!activeCard) return null;
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const priority = formData.get('priority') as "high" | "medium" | "low" | undefined;
    
    const updatedCard: KanbanCardItem = {
      ...activeCard,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      value: Number(formData.get('value')),
      priority: priority || 'medium',
    };
    
    onUpdate(updatedCard);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Lead</DialogTitle>
          <DialogDescription>
            Atualize as informações do lead.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Nome do Lead*</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={activeCard.title}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={activeCard.description}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-value">Valor Potencial (R$)</Label>
                <Input
                  id="edit-value"
                  name="value"
                  type="number"
                  min="0"
                  step="100"
                  defaultValue={activeCard.value}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Prioridade</Label>
                <Select name="priority" defaultValue={activeCard.priority || "medium"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
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
              <div className="flex items-center justify-between">
                <Label>Etiquetas</Label>
                <Button type="button" variant="ghost" size="sm" className="h-8 gap-1">
                  <Tag size={14} />
                  <span>Adicionar</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {activeCard.tags?.map((tag, index) => (
                  <div key={index} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}>
                    {tag.label}
                    <Button type="button" variant="ghost" size="icon" className="h-4 w-4 ml-1">
                      <X size={10} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Atribuído a</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={activeCard.assignedTo?.avatar || "/placeholder.svg"} 
                    alt={activeCard.assignedTo?.name} 
                  />
                  <AvatarFallback>
                    {activeCard.assignedTo?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activeCard.assignedTo?.name}</p>
                </div>
                <Button type="button" variant="ghost" size="sm" className="gap-1">
                  <User size={14} />
                  <span>Alterar</span>
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" size="icon">
              <Share2 size={16} />
            </Button>
            <div className="flex-1"></div>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
