
import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingCreated?: () => void;
}

const NewMeetingDialog = ({ open, onOpenChange, onMeetingCreated }: NewMeetingDialogProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("1");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { company } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!company?.id) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('meetings')
        .insert({
          title,
          date,
          time,
          description,
          participants: parseInt(participants),
          company_id: company.id,
          status: 'scheduled'
        });

      if (error) throw error;
      
      toast({
        title: "Reunião agendada",
        description: `${title} foi agendada para ${new Date(date).toLocaleDateString('pt-BR')} às ${time}.`
      });
      
      onOpenChange(false);
      onMeetingCreated?.();
      
      // Reset form fields
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
      setParticipants("1");
    } catch (error) {
      console.error('Erro ao criar reunião:', error);
      toast({
        title: "Erro",
        description: "Erro ao agendar reunião.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Reunião</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Reunião *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Digite o título da reunião" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participants">Número de Participantes</Label>
            <Select value={participants} onValueChange={setParticipants}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar quantidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 pessoa</SelectItem>
                <SelectItem value="2">2 pessoas</SelectItem>
                <SelectItem value="3">3 pessoas</SelectItem>
                <SelectItem value="4">4 pessoas</SelectItem>
                <SelectItem value="5">5+ pessoas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Detalhes da reunião..." 
              rows={3}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Agendando..." : "Agendar Reunião"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewMeetingDialog;
