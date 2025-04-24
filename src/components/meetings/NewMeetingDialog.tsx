
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reunião agendada",
      description: "Sua reunião foi agendada com sucesso."
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Reunião</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Reunião</Label>
            <Input id="title" placeholder="Ex: Reunião de Planejamento" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input id="time" type="time" required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <select 
                id="duration"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                required
              >
                <option value="30min">30 minutos</option>
                <option value="1h" selected>1 hora</option>
                <option value="1h30min">1 hora e 30 minutos</option>
                <option value="2h">2 horas</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurrence">Recorrência</Label>
              <select 
                id="recurrence"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
              >
                <option value="none" selected>Não se repete</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensalmente</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participants">Participantes</Label>
            <Input id="participants" placeholder="Adicionar participantes por email" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <textarea 
              id="description"
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 resize-y"
              placeholder="Adicione detalhes sobre a reunião..."
            ></textarea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agendar Reunião</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMeetingDialog;
