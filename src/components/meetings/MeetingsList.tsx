
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MeetingItem from "./MeetingItem";

// Definindo uma interface para os dados de reuniões
interface Meeting {
  id: string;
  name: string;
  description?: string;
  status: string;
  date?: string;
  time?: string;
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
          status: "meeting",
          date: "2025-05-01",
          time: "14:00"
        },
        {
          id: "2",
          name: "Apresentação para Clientes",
          description: "Apresentar novos recursos do produto",
          status: "meeting",
          date: "2025-05-03", 
          time: "10:00"
        },
        {
          id: "3",
          name: "Review de Sprint",
          description: "Revisar tarefas completadas no sprint",
          status: "meeting",
          date: "2025-05-05",
          time: "15:30"
        }
      ];
      
      setMeetings(mockMeetings);
      setLoading(false);
    }
    fetchMeetings();
  }, []);

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
      <div className="p-4 text-center text-muted-foreground text-sm">
        Ainda não há dados suficientes. Adicione para ver os resultados.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Reuniões Agendadas</h2>
        <Button size="sm">
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
            <div className="font-medium text-sm">{meeting.name}</div>
            <div className="text-xs text-muted-foreground">{meeting.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsList;
