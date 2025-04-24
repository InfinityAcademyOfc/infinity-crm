
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MeetingItem from "./MeetingItem";

// Definindo uma interface para os dados de reuniões
interface Meeting {
  id: string;
  name: string;
  description?: string;
  status: string;
}

const MeetingsList = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true);
      
      // Usando dados mockados temporariamente até criar a tabela de tasks/meetings
      const mockMeetings = [
        {
          id: "1",
          name: "Reunião de Planejamento Semanal",
          description: "Discutir metas e objetivos da semana",
          status: "meeting"
        },
        {
          id: "2",
          name: "Apresentação para Clientes",
          description: "Apresentar novos recursos do produto",
          status: "meeting"
        },
        {
          id: "3",
          name: "Review de Sprint",
          description: "Revisar tarefas completadas no sprint",
          status: "meeting"
        }
      ];
      
      setMeetings(mockMeetings);
      setLoading(false);
    }
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span>Carregando reuniões...</span>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Ainda não há dados suficientes. Adicione para ver os resultados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reuniões Agendadas</h2>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Nova Reunião
        </Button>
      </div>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="p-4 bg-muted rounded shadow"
          >
            <div className="font-semibold">{meeting.name}</div>
            <div className="text-sm text-muted-foreground">{meeting.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsList;
