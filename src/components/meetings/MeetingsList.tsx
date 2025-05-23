
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import NewMeetingDialog from "./NewMeetingDialog";

interface Meeting {
  id: string;
  title: string;
  description?: string;
  status: string;
  date?: string;
  time?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

const MeetingsList = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const { user, company } = useAuth();

  const fetchMeetings = async () => {
    if (!company?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', company.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
      toast.error('Erro ao carregar reuniões');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [company]);

  if (!user || !company) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Faça login para visualizar reuniões
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        <span className="text-sm">Carregando reuniões...</span>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Reuniões Agendadas</h2>
          <Button size="sm" onClick={() => setNewMeetingOpen(true)}>
            <PlusCircle size={14} className="mr-1.5" />
            Nova Reunião
          </Button>
        </div>
        <div className="p-4 text-center text-muted-foreground text-sm">
          Nenhuma reunião agendada. Clique em "Nova Reunião" para começar.
        </div>
        <NewMeetingDialog 
          open={newMeetingOpen} 
          onOpenChange={setNewMeetingOpen}
          onMeetingCreated={fetchMeetings}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reuniões Agendadas</h2>
        <Button size="sm" onClick={() => setNewMeetingOpen(true)}>
          <PlusCircle size={14} className="mr-1.5" />
          Nova Reunião
        </Button>
      </div>
      <div className="space-y-2">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-3 bg-muted rounded shadow-sm"
          >
            <div className="font-medium text-sm">{meeting.title}</div>
            {meeting.description && (
              <div className="text-xs text-muted-foreground">{meeting.description}</div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              {meeting.date && new Date(meeting.date).toLocaleDateString('pt-BR')} 
              {meeting.time && ` às ${meeting.time}`}
            </div>
          </div>
        ))}
      </div>
      <NewMeetingDialog 
        open={newMeetingOpen} 
        onOpenChange={setNewMeetingOpen}
        onMeetingCreated={fetchMeetings}
      />
    </div>
  );
};

export default MeetingsList;
