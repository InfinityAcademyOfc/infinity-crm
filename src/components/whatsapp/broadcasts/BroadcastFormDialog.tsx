
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Broadcast {
  id: string;
  title: string;
  message?: string;
  media_url?: string;
  scheduled_for?: string;
  status?: string;
}

interface BroadcastFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broadcast: Broadcast | null;
  onSave: (broadcast: Partial<Broadcast>) => void;
  sessionId: string;
}

const BroadcastFormDialog = ({ 
  open, 
  onOpenChange, 
  broadcast, 
  onSave,
  sessionId
}: BroadcastFormDialogProps) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("12:00");
  
  // Reset form when broadcast changes
  useEffect(() => {
    if (broadcast) {
      setTitle(broadcast.title || "");
      setMessage(broadcast.message || "");
      setMediaUrl(broadcast.media_url || "");
      
      if (broadcast.scheduled_for) {
        const scheduledDate = new Date(broadcast.scheduled_for);
        setDate(scheduledDate);
        
        const hours = scheduledDate.getHours().toString().padStart(2, '0');
        const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      } else {
        setDate(undefined);
        setTime("12:00");
      }
    } else {
      setTitle("");
      setMessage("");
      setMediaUrl("");
      setDate(undefined);
      setTime("12:00");
    }
  }, [broadcast, open]);
  
  const handleSave = () => {
    // Basic validation
    if (!title.trim()) {
      return;
    }
    
    // Prepare scheduled_for timestamp
    let scheduledFor: string | undefined = undefined;
    if (date) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes, 0, 0);
      scheduledFor = scheduledDate.toISOString();
    }
    
    onSave({
      title: title.trim(),
      message: message.trim() || undefined,
      media_url: mediaUrl.trim() || undefined,
      scheduled_for: scheduledFor,
      // sessionId is handled in the parent component
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{broadcast ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Mensagem
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              rows={5}
              placeholder="Escreva a mensagem que será enviada"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="media-url" className="text-right">
              URL de Mídia
            </Label>
            <Input
              id="media-url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="col-span-3"
              placeholder="URL da imagem, áudio ou documento (opcional)"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Agendamento
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Destinatários
            </Label>
            <div className="col-span-3">
              <Tabs defaultValue="lists" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="lists">Listas</TabsTrigger>
                  <TabsTrigger value="filters">Filtros</TabsTrigger>
                </TabsList>
                <TabsContent value="lists">
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-muted-foreground">
                      Selecione as listas que receberão esta campanha
                    </p>
                    <Button variant="outline" className="mt-2">
                      Selecionar Listas
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="filters">
                  <div className="text-center p-4 border rounded-md">
                    <p className="text-muted-foreground">
                      Configure filtros para selecionar contatos específicos
                    </p>
                    <Button variant="outline" className="mt-2">
                      Configurar Filtros
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            {broadcast ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastFormDialog;
