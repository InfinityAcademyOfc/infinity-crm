
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface MeetingParticipant {
  name: string;
  avatar?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: MeetingParticipant[];
  responsible: MeetingParticipant;
  host: string;
  onJoin: () => void;
}

// Mock meeting data
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Reunião de Planejamento Semanal",
    date: "14/04/2025",
    time: "10:00",
    duration: "1h",
    participants: [
      { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
      { name: "Ana Oliveira" },
      { name: "Marcelo Santos" },
      { name: "Juliana Costa" }
    ],
    responsible: { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
    host: "Carlos Silva",
    onJoin: () => {}
  },
  {
    id: "2",
    title: "Análise de Resultados Q1",
    date: "15/04/2025",
    time: "14:30",
    duration: "1h 30min",
    participants: [
      { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
      { name: "Fernanda Lima" },
      { name: "Ricardo Gomes" }
    ],
    responsible: { name: "Ricardo Gomes" },
    host: "Ricardo Gomes",
    onJoin: () => {}
  },
  {
    id: "3",
    title: "Apresentação de Novo Produto",
    date: "18/04/2025",
    time: "09:00",
    duration: "2h",
    participants: [
      { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
      { name: "Ana Oliveira" },
      { name: "Marcelo Santos" },
      { name: "Juliana Costa" },
      { name: "Fernando Alves" }
    ],
    responsible: { name: "Ana Oliveira" },
    host: "Ana Oliveira",
    onJoin: () => {}
  }
];

export const useMeetingsData = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    const loadMeetings = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update meetings with proper onJoin handlers
        const meetingsWithHandlers = mockMeetings.map(meeting => ({
          ...meeting,
          onJoin: () => handleJoinMeeting(meeting)
        }));
        
        setMeetings(meetingsWithHandlers);
      } catch (error) {
        console.error('Erro ao carregar reuniões:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar reuniões",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadMeetings();
  }, []);

  const handleJoinMeeting = (meeting: Meeting) => {
    console.log(`Joining meeting: ${meeting.title}`);
    // This will be handled by the parent component
  };

  const createInstantMeeting = (): Meeting => {
    return {
      id: `instant-${Date.now()}`,
      title: "Reunião Instantânea",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: "Indeterminado",
      participants: [
        { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" }
      ],
      responsible: { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
      host: "Carlos Silva",
      onJoin: () => {}
    };
  };

  const filterMeetings = (searchQuery: string, dateFilter: string, responsibleFilter: string) => {
    return meetings.filter(meeting => {
      const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = dateFilter ? meeting.date === dateFilter : true;
      const matchesResponsible = responsibleFilter ? 
        meeting.responsible?.name === responsibleFilter : true;
      
      return matchesSearch && matchesDate && matchesResponsible;
    });
  };

  const getUniqueResponsibles = () => {
    return Array.from(
      new Set(meetings.map(meeting => meeting.responsible?.name))
    ).filter(Boolean);
  };

  return {
    meetings,
    loading,
    createInstantMeeting,
    filterMeetings,
    getUniqueResponsibles
  };
};
