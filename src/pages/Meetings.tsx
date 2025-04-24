
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Video } from "lucide-react";
import NewMeetingDialog from "@/components/meetings/NewMeetingDialog";
import MeetingCard from "@/components/meetings/MeetingCard";
import MeetingVideoContainer from "@/components/meetings/MeetingVideoContainer";

// Mock meeting data
const mockMeetings = [
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
    host: "Carlos Silva",
    onJoin: () => {} // Default empty function to satisfy the type requirement
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
    host: "Ricardo Gomes",
    onJoin: () => {} // Default empty function to satisfy the type requirement
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
    host: "Ana Oliveira",
    onJoin: () => {} // Default empty function to satisfy the type requirement
  }
];

const Meetings = () => {
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const { toast } = useToast();

  const startMeetingNow = () => {
    // Create a new instant meeting
    const instantMeeting = {
      id: `instant-${Date.now()}`,
      title: "Reunião Instantânea",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: "Indeterminado",
      participants: [
        { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" }
      ],
      host: "Carlos Silva",
      onJoin: () => {} // Default empty function to satisfy the type requirement
    };
    
    setCurrentMeeting(instantMeeting);
    setIsInMeeting(true);
    toast({
      title: "Reunião iniciada",
      description: "Sua reunião instantânea foi iniciada com sucesso."
    });
  };

  const joinMeeting = (meeting: any) => {
    setCurrentMeeting(meeting);
    setIsInMeeting(true);
    toast({
      title: "Reunião iniciada",
      description: `Você entrou na reunião: ${meeting.title}`
    });
  };

  const leaveMeeting = () => {
    setIsInMeeting(false);
    setCurrentMeeting(null);
    toast({
      title: "Reunião encerrada",
      description: "Você saiu da reunião."
    });
  };

  // Return meeting interface when in a meeting
  if (isInMeeting && currentMeeting) {
    return <MeetingVideoContainer meeting={currentMeeting} onLeave={leaveMeeting} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
          >
            Filtrar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
          >
            Calendário
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={startMeetingNow}
            size="sm"
            className="flex items-center gap-2"
          >
            <Video size={16} />
            Iniciar Agora
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsNewMeetingOpen(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Nova Reunião
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="bg-muted/80 shadow-sm">
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Anteriores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {mockMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} onJoin={joinMeeting} />
          ))}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Histórico de reuniões anteriores aparecerá aqui.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <NewMeetingDialog 
        open={isNewMeetingOpen} 
        onOpenChange={setIsNewMeetingOpen} 
      />
    </div>
  );
};

export default Meetings;
