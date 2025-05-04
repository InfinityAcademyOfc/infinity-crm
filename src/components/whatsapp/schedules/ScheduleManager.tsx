
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MessageSquare, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ScheduleFormDialog from "./ScheduleFormDialog";
import { supabase } from "@/lib/supabase";

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
  created_at: string;
}

const ScheduleManager = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  // Fetch schedules from Supabase
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("schedules")
          .select("*")
          .order("scheduled_at", { ascending: false });
          
        if (error) throw error;
        setSchedules(data || []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast({
          title: "Erro ao carregar agendamentos",
          description: "Não foi possível carregar os agendamentos. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchedules();

    // Set up real-time listener for schedules updates
    const channel = supabase
      .channel("schedules_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "schedules",
        },
        (payload) => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setFormOpen(true);
  };
  
  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setFormOpen(true);
  };
  
  const handleDeleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso."
      });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast({
        title: "Erro ao excluir agendamento",
        description: "Não foi possível excluir o agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveSchedule = async (schedule: Partial<Schedule>) => {
    try {
      if (selectedSchedule) {
        // Update existing schedule
        const { error } = await supabase
          .from("schedules")
          .update({
            message: schedule.message,
            media_url: schedule.media_url,
            scheduled_at: schedule.scheduled_at,
            contact_id: schedule.contact_id,
            list_id: schedule.list_id,
            type: schedule.type
          })
          .eq("id", selectedSchedule.id);
          
        if (error) throw error;
        
        toast({
          title: "Agendamento atualizado",
          description: "O agendamento foi atualizado com sucesso."
        });
      } else {
        // Create new schedule
        const { data, error } = await supabase
          .from("schedules")
          .insert({
            message: schedule.message,
            media_url: schedule.media_url,
            scheduled_at: schedule.scheduled_at,
            contact_id: schedule.contact_id,
            list_id: schedule.list_id,
            type: schedule.type || 'individual',
            sent: false,
            failed: false
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: "Agendamento criado",
          description: "O novo agendamento foi criado com sucesso."
        });
      }
      
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast({
        title: "Erro ao salvar agendamento",
        description: "Não foi possível salvar o agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => 
    schedule.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render status badge
  const renderStatusBadge = (schedule: Schedule) => {
    if (schedule.sent) {
      return <Badge variant="default" className="bg-green-600 flex items-center gap-1">
        <CheckCircle size={12} /> Enviado
      </Badge>;
    } else if (schedule.failed) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle size={12} /> Falha
      </Badge>;
    } else {
      const scheduledDate = new Date(schedule.scheduled_at);
      const now = new Date();
      return <Badge variant="outline" className="flex items-center gap-1">
        <Clock size={12} /> {scheduledDate > now ? "Agendado" : "Pendente"}
      </Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar agendamentos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleAddSchedule}>
              <Plus size={16} className="mr-2" /> Novo Agendamento
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando agendamentos...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum agendamento encontrado" : "Nenhum agendamento cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-[250px]">
                          <MessageSquare size={16} className="text-muted-foreground shrink-0" />
                          <span className="truncate">{schedule.message}</span>
                        </div>
                        {schedule.media_url && (
                          <Badge variant="outline" className="mt-1">Mídia</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {schedule.type === 'individual' ? (
                          <Badge variant="outline">Contato Individual</Badge>
                        ) : (
                          <Badge variant="outline">Lista</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-muted-foreground" />
                          {new Date(schedule.scheduled_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(schedule)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditSchedule(schedule)}
                            disabled={schedule.sent || schedule.failed}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <ScheduleFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          schedule={selectedSchedule}
          onSave={handleSaveSchedule}
        />
      </CardContent>
    </Card>
  );
};

export default ScheduleManager;
