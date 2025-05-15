
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, User, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface ContactList {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  message: string;
  media_url?: string;
  scheduled_at: string;
  contact_id?: string;
  list_id?: string;
  type: 'individual' | 'list';
  sent: boolean;
  failed: boolean;
}

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: Schedule | null;
  onSave: (schedule: Partial<Schedule>) => void;
}

const ScheduleFormDialog = ({ 
  open, 
  onOpenChange, 
  schedule, 
  onSave 
}: ScheduleFormDialogProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("12:00");
  const [recipientType, setRecipientType] = useState<'individual' | 'list'>('individual');
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(undefined);
  const [selectedListId, setSelectedListId] = useState<string | undefined>(undefined);
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [lists, setLists] = useState<ContactList[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  
  // Reset form when schedule changes
  useEffect(() => {
    if (schedule) {
      setMessage(schedule.message || "");
      setMediaUrl(schedule.media_url || "");
      
      if (schedule.scheduled_at) {
        const scheduledDate = new Date(schedule.scheduled_at);
        setDate(scheduledDate);
        
        const hours = scheduledDate.getHours().toString().padStart(2, '0');
        const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      } else {
        setDate(new Date());
        setTime("12:00");
      }
      
      setRecipientType(schedule.type || 'individual');
      setSelectedContactId(schedule.contact_id);
      setSelectedListId(schedule.list_id);
    } else {
      setMessage("");
      setMediaUrl("");
      setDate(new Date());
      setTime("12:00");
      setRecipientType('individual');
      setSelectedContactId(undefined);
      setSelectedListId(undefined);
    }
  }, [schedule, open]);
  
  // Fetch contacts and lists
  useEffect(() => {
    if (open) {
      const fetchContacts = async () => {
        setLoadingContacts(true);
        try {
          const { data, error } = await supabase
            .from("contacts")
            .select("id, name, phone")
            .order("name");
            
          if (error) throw error;
          setContacts(data || []);
        } catch (error) {
          console.error("Error fetching contacts:", error);
          toast({
            title: "Erro ao carregar contatos",
            description: "Não foi possível carregar os contatos.",
            variant: "destructive"
          });
        } finally {
          setLoadingContacts(false);
        }
      };
      
      const fetchLists = async () => {
        setLoadingLists(true);
        try {
          const { data, error } = await supabase
            .from("lists")
            .select("id, name")
            .order("name");
            
          if (error) throw error;
          setLists(data || []);
        } catch (error) {
          console.error("Error fetching lists:", error);
          toast({
            title: "Erro ao carregar listas",
            description: "Não foi possível carregar as listas.",
            variant: "destructive"
          });
        } finally {
          setLoadingLists(false);
        }
      };
      
      fetchContacts();
      fetchLists();
    }
  }, [open, toast]);
  
  const handleSave = () => {
    // Basic validation
    if (!message.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, digite uma mensagem para agendar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data para o agendamento.",
        variant: "destructive"
      });
      return;
    }
    
    if (recipientType === 'individual' && !selectedContactId) {
      toast({
        title: "Contato obrigatório",
        description: "Por favor, selecione um contato para o agendamento individual.",
        variant: "destructive"
      });
      return;
    }
    
    if (recipientType === 'list' && !selectedListId) {
      toast({
        title: "Lista obrigatória",
        description: "Por favor, selecione uma lista para o agendamento em massa.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare scheduled_at timestamp
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    onSave({
      message: message.trim(),
      media_url: mediaUrl.trim() || undefined,
      scheduled_at: scheduledDate.toISOString(),
      contact_id: recipientType === 'individual' ? selectedContactId : undefined,
      list_id: recipientType === 'list' ? selectedListId : undefined,
      type: recipientType
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{schedule ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Digite a mensagem que será enviada"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="media-url">URL da mídia (opcional)</Label>
            <Input
              id="media-url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data</Label>
              <div className="relative mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="time">Hora</Label>
              <div className="flex items-center mt-1">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <Tabs value={recipientType} onValueChange={(v) => setRecipientType(v as 'individual' | 'list')}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="individual" className="flex items-center gap-2">
                <User size={14} />
                Contato Individual
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Users size={14} />
                Lista de Contatos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual">
              <div>
                <Label htmlFor="contact-id">Selecione o contato</Label>
                <select
                  id="contact-id"
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={loadingContacts}
                >
                  <option value="">Selecione um contato</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} ({contact.phone})
                    </option>
                  ))}
                </select>
                {loadingContacts && <p className="text-sm text-muted-foreground mt-2">Carregando contatos...</p>}
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div>
                <Label htmlFor="list-id">Selecione a lista</Label>
                <select
                  id="list-id"
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  disabled={loadingLists}
                >
                  <option value="">Selecione uma lista</option>
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
                {loadingLists && <p className="text-sm text-muted-foreground mt-2">Carregando listas...</p>}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            {schedule ? "Atualizar" : "Agendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleFormDialog;
