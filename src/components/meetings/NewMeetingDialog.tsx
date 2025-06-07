
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Dummy team members for demonstration
const teamMembers = [
  { id: "user1", name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
  { id: "user2", name: "Ana Oliveira", avatar: "/placeholder.svg" },
  { id: "user3", name: "Miguel Santos", avatar: "/placeholder.svg" },
  { id: "user4", name: "Juliana Costa", avatar: "/placeholder.svg" },
];

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [responsible, setResponsible] = useState("");
  const [isCurrentUserResponsible, setIsCurrentUserResponsible] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !date || !time) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Determine responsible person
    const finalResponsible = isCurrentUserResponsible ? "user1" : responsible;

    // Create meeting object
    const meeting = {
      title,
      date,
      time,
      duration: `${duration} min`,
      description,
      participants: participants.map(id => {
        const member = teamMembers.find(m => m.id === id);
        return { name: member?.name || "", avatar: member?.avatar || "" };
      }),
      responsible: finalResponsible ? 
        teamMembers.find(m => m.id === finalResponsible) : 
        { id: "user1", name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" }
    };
    
    // Log the new meeting (would be saved to a database in a real app)
    console.log("New meeting created:", meeting);
    
    // Show success toast
    toast({
      title: "Reunião agendada",
      description: `${title} foi agendada para ${date} às ${time}.`
    });
    
    // Close dialog and reset form
    onOpenChange(false);
    
    // Reset form fields
    setTitle("");
    setDate("");
    setTime("");
    setDuration("60");
    setDescription("");
    setParticipants([]);
    setResponsible("");
    setIsCurrentUserResponsible(false);
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
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1 hora e 30 minutos</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
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

          <div className="space-y-2">
            <Label>Responsável *</Label>
            <div className="flex items-center gap-2 mb-2">
              <Switch
                checked={isCurrentUserResponsible}
                onCheckedChange={setIsCurrentUserResponsible}
                id="self-responsible"
              />
              <Label htmlFor="self-responsible" className="cursor-pointer">
                Eu sou o responsável
              </Label>
            </div>
            
            {!isCurrentUserResponsible && (
              <Select value={responsible} onValueChange={setResponsible} disabled={isCurrentUserResponsible}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Participantes</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar participantes" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {participants.map((participantId) => {
                const participant = teamMembers.find(m => m.id === participantId);
                return participant ? (
                  <div
                    key={participant.id}
                    className="flex items-center gap-1 bg-secondary/30 px-2 py-1 rounded-md"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{participant.name}</span>
                    <button
                      type="button"
                      onClick={() => setParticipants(participants.filter(id => id !== participant.id))}
                      className="text-gray-500 hover:text-gray-700 ml-1"
                    >
                      &times;
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
