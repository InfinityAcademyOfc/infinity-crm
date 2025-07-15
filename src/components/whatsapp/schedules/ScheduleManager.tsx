
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
  FileImage,
  Clock,
  CheckCircle,
  AlertTriangle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase";

interface Schedule {
  id: string;
  message: string;
  scheduled_at: string;
  sent: boolean;
  failed: boolean;
  media_url?: string;
  contact_id?: string;
  list_id?: string;
  type?: string;
  contact_name?: string;
  list_name?: string;
  session_id?: string;
}

interface ScheduleManagerProps {
  sessionId: string;
}

const ScheduleManager = ({ sessionId }: ScheduleManagerProps) => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Fetch schedules from Supabase
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("schedules")
          .select(`
            *,
            contacts:contact_id (name),
            lists:list_id (name)
          `)
          .order("scheduled_at", { ascending: true });
          
        if (error) throw error;
        
        // Format data with contact/list names
        const formattedSchedules = (data || []).map((schedule: any) => ({
          ...schedule,
          contact_name: schedule.contacts?.name,
          list_name: schedule.lists?.name
        }));
        
        setSchedules(formattedSchedules);
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
  }, [toast, sessionId]);
  
  const handleAddSchedule = () => {
    setShowForm(true);
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
  
  // Filter schedules based on search term
  const filteredSchedules = schedules.filter(schedule => 
    schedule.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (schedule.contact_name && schedule.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (schedule.list_name && schedule.list_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                        <div className="max-w-[250px] truncate">
                          {schedule.message}
                        </div>
                        {schedule.media_url && (
                          <Badge variant="outline" className="mt-1">
                            <FileImage size={12} className="mr-1" /> Mídia
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {schedule.contact_id && (
                          <Badge variant="outline">
                            {schedule.contact_name || "Contato"}
                          </Badge>
                        )}
                        {schedule.list_id && (
                          <Badge variant="outline">
                            Lista: {schedule.list_name || "Lista"}
                          </Badge>
                        )}
                        {!schedule.contact_id && !schedule.list_id && (
                          <span className="text-muted-foreground">Não definido</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-muted-foreground" />
                          {new Date(schedule.scheduled_at).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {schedule.sent ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle size={12} className="mr-1" /> Enviado
                          </Badge>
                        ) : schedule.failed ? (
                          <Badge className="bg-red-50 text-red-700 border-red-200">
                            <AlertTriangle size={12} className="mr-1" /> Falhou
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Clock size={12} className="mr-1" /> Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {/* Handle edit */}}
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
        
        {/* Add a placeholder for schedule form dialog */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h3 className="text-lg font-medium mb-4">Novo Agendamento</h3>
              <p className="text-muted-foreground mb-4">
                Funcionalidade em desenvolvimento
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setShowForm(false)}>Fechar</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleManager;
