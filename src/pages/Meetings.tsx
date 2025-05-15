
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Video, Filter, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import NewMeetingDialog from "@/components/meetings/NewMeetingDialog";
import MeetingCard from "@/components/meetings/MeetingCard";
import MeetingVideoContainer from "@/components/meetings/MeetingVideoContainer";
import MeetingCalendarView from "@/components/meetings/MeetingCalendarView";

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
    responsible: { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
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
    responsible: { name: "Ricardo Gomes" },
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
    responsible: { name: "Ana Oliveira" },
    host: "Ana Oliveira",
    onJoin: () => {} // Default empty function to satisfy the type requirement
  }
];

const Meetings = () => {
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [viewMode, setViewMode] = useState("list");
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<any>(null);
  const [isLeavingMeeting, setIsLeavingMeeting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();

  // Get unique responsibles from meetings
  const responsibles = Array.from(
    new Set(mockMeetings.map(meeting => meeting.responsible?.name))
  ).filter(Boolean);

  // Filter meetings based on criteria
  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dateFilter ? meeting.date === dateFilter : true;
    const matchesResponsible = responsibleFilter ? 
      meeting.responsible?.name === responsibleFilter : true;
    
    return matchesSearch && matchesDate && matchesResponsible;
  });

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
      responsible: { name: "Carlos Silva", avatar: "/avatar-placeholder.jpg" },
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

  const tryToLeaveMeeting = () => {
    setIsLeavingMeeting(true);
  };

  const confirmLeaveMeeting = () => {
    setIsInMeeting(false);
    setCurrentMeeting(null);
    setIsLeavingMeeting(false);
    toast({
      title: "Reunião encerrada",
      description: "Você saiu da reunião."
    });
  };

  const cancelLeaveMeeting = () => {
    setIsLeavingMeeting(false);
  };

  // Return meeting interface when in a meeting
  if (isInMeeting && currentMeeting) {
    return (
      <>
        <MeetingVideoContainer 
          meeting={currentMeeting} 
          onLeave={tryToLeaveMeeting}
        />
        
        {/* Confirmation Dialog */}
        <Dialog open={isLeavingMeeting} onOpenChange={setIsLeavingMeeting}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar saída</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja sair da reunião?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={cancelLeaveMeeting}>Não</Button>
              <Button variant="destructive" onClick={confirmLeaveMeeting}>Sim, sair</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} className="mr-1" />
            Filtrar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={`h-8 px-2 text-xs bg-card dark:bg-gray-800/60 shadow-sm ${viewMode === 'calendar' ? 'bg-primary/20' : ''}`}
            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
          >
            <Calendar size={16} className="mr-1" />
            Calendário
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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
      
      {/* Filter panel */}
      {isFilterOpen && (
        <div className="p-4 border rounded-lg bg-card shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar reuniões..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Data</label>
              <Input 
                type="date" 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Responsável</label>
              <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os responsáveis</SelectItem>
                  {responsibles.map((responsible, index) => (
                    <SelectItem key={index} value={responsible as string}>
                      {responsible}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDateFilter('');
                setResponsibleFilter('');
                setSearchQuery('');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>
      )}

      {viewMode === 'calendar' ? (
        <MeetingCalendarView meetings={filteredMeetings} onJoinMeeting={joinMeeting} />
      ) : (
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
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} onJoin={joinMeeting} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>Nenhuma reunião encontrada para os filtros selecionados.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Histórico de reuniões anteriores aparecerá aqui.</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <NewMeetingDialog 
        open={isNewMeetingOpen} 
        onOpenChange={setIsNewMeetingOpen} 
      />
    </div>
  );
};

export default Meetings;
