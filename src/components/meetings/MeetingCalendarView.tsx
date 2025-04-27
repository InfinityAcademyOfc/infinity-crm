
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MeetingParticipant {
  name: string;
  avatar?: string;
}

interface MeetingDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: MeetingParticipant[];
  responsible?: { name: string; avatar?: string };
  host: string;
}

interface MeetingCalendarViewProps {
  meetings: MeetingDetails[];
  onJoinMeeting: (meeting: MeetingDetails) => void;
}

const MeetingCalendarView = ({ meetings, onJoinMeeting }: MeetingCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetails | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [editableDate, setEditableDate] = useState("");
  const [editableTime, setEditableTime] = useState("");

  // Function to convert date strings to Date objects
  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Filter meetings for the selected date
  const meetingsForSelectedDate = selectedDate ? meetings.filter(meeting => {
    const meetingDate = parseDate(meeting.date);
    return (
      meetingDate.getDate() === selectedDate.getDate() &&
      meetingDate.getMonth() === selectedDate.getMonth() &&
      meetingDate.getFullYear() === selectedDate.getFullYear()
    );
  }) : [];

  // Check if a date has meetings
  const hasDateMeeting = (date: Date) => {
    return meetings.some(meeting => {
      const meetingDate = parseDate(meeting.date);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const openMeetingDetails = (meeting: MeetingDetails) => {
    setSelectedMeeting(meeting);
    setEditableTitle(meeting.title);
    setEditableDescription("Descrição da reunião...");
    setEditableDate(meeting.date.split('/').reverse().join('-'));
    setEditableTime(meeting.time);
    setIsDetailsOpen(true);
    setIsEditMode(false);
  };

  const saveEditedMeeting = () => {
    // In a real application, this would update the meeting in the database
    console.log("Saving edited meeting:", {
      ...selectedMeeting,
      title: editableTitle,
      date: editableDate,
      time: editableTime
    });
    
    setIsEditMode(false);
    // Would typically reload meetings here
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Calendário de Reuniões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md p-3"
              modifiers={{
                meeting: (date) => hasDateMeeting(date),
              }}
              modifiersClassNames={{
                meeting: "relative before:absolute before:bottom-0 before:left-1/2 before:w-1 before:h-1 before:bg-primary before:rounded-full"
              }}
            />
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm">
                {selectedDate ? selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Selecione uma data'}
              </h3>
              
              {meetingsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {meetingsForSelectedDate.map(meeting => (
                    <div 
                      key={meeting.id} 
                      className="p-3 border rounded-lg bg-background hover:bg-accent/20 cursor-pointer flex justify-between items-center"
                      onClick={() => openMeetingDetails(meeting)}
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium">{meeting.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{meeting.time}</span>
                          <span className="mx-2">•</span>
                          <span>{meeting.duration}</span>
                          {meeting.responsible && (
                            <>
                              <span className="mx-2">•</span>
                              <div className="flex items-center">
                                <Avatar className="h-4 w-4 mr-1">
                                  <AvatarImage src={meeting.responsible.avatar} />
                                  <AvatarFallback>{meeting.responsible.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span>{meeting.responsible.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMeetingDetails(meeting);
                          }}
                        >
                          <Info size={16} />
                        </Button>
                        <Button 
                          variant="default" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onJoinMeeting(meeting);
                          }}
                        >
                          <Video size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma reunião agendada para esta data.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Reunião" : "Detalhes da Reunião"}</DialogTitle>
          </DialogHeader>
          
          {selectedMeeting && (
            <div className="space-y-4">
              {isEditMode ? (
                // Edit mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <Input 
                      value={editableTitle} 
                      onChange={(e) => setEditableTitle(e.target.value)} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Data</label>
                      <Input 
                        type="date" 
                        value={editableDate} 
                        onChange={(e) => setEditableDate(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Hora</label>
                      <Input 
                        type="time" 
                        value={editableTime} 
                        onChange={(e) => setEditableTime(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <Textarea 
                      value={editableDescription} 
                      onChange={(e) => setEditableDescription(e.target.value)} 
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                // View mode
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMeeting.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                      <Badge variant="outline" className="px-2 py-0.5">
                        {selectedMeeting.date} às {selectedMeeting.time}
                      </Badge>
                      <Badge variant="outline" className="px-2 py-0.5">
                        {selectedMeeting.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedMeeting.responsible && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Responsável</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedMeeting.responsible.avatar} />
                          <AvatarFallback>
                            {selectedMeeting.responsible.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedMeeting.responsible.name}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Participantes ({selectedMeeting.participants.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeeting.participants.map((participant, idx) => (
                        <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Descrição</h4>
                    <p className="text-sm text-muted-foreground">
                      {editableDescription || "Sem descrição disponível."}
                    </p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2 sm:gap-0 mt-4">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancelar</Button>
                    <Button onClick={saveEditedMeeting}>Salvar</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditMode(true)}>Editar</Button>
                    <Button onClick={() => onJoinMeeting(selectedMeeting)}>Entrar na Reunião</Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingCalendarView;
