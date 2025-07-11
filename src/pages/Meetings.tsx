
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
import { ScrollArea } from "@/components/ui/scroll-area";
import NewMeetingDialog from "@/components/meetings/NewMeetingDialog";
import MeetingCard from "@/components/meetings/MeetingCard";
import MeetingVideoContainer from "@/components/meetings/MeetingVideoContainer";
import MeetingCalendarView from "@/components/meetings/MeetingCalendarView";
import { MeetingHeader } from "@/components/meetings/MeetingHeader";
import { useMeetingsData, Meeting } from "@/hooks/useMeetingsData";

const Meetings = () => {
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [viewMode, setViewMode] = useState("list");
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [isLeavingMeeting, setIsLeavingMeeting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();
  const { meetings, loading, createInstantMeeting, filterMeetings, getUniqueResponsibles } = useMeetingsData();

  const responsibles = getUniqueResponsibles();
  const filteredMeetings = filterMeetings(searchQuery, dateFilter, responsibleFilter);

  const startMeetingNow = () => {
    const instantMeeting = createInstantMeeting();
    setCurrentMeeting(instantMeeting);
    setIsInMeeting(true);
    toast({
      title: "Reunião iniciada",
      description: "Sua reunião instantânea foi iniciada com sucesso."
    });
  };

  const joinMeeting = (meeting: Meeting) => {
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

  const handleClearFilters = () => {
    setDateFilter('');
    setResponsibleFilter('');
    setSearchQuery('');
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="h-32 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MeetingHeader
        viewMode={viewMode}
        isFilterOpen={isFilterOpen}
        searchQuery={searchQuery}
        dateFilter={dateFilter}
        responsibleFilter={responsibleFilter}
        responsibles={responsibles}
        onViewModeChange={setViewMode}
        onStartInstantMeeting={startMeetingNow}
        onOpenNewMeeting={() => setIsNewMeetingOpen(true)}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onSearchChange={setSearchQuery}
        onDateFilterChange={setDateFilter}
        onResponsibleFilterChange={setResponsibleFilter}
        onClearFilters={handleClearFilters}
      />

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
