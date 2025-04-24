
import { format, parseISO, isAfter, addMinutes, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Video, Users, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MeetingItemProps {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  participants: number;
  link?: string;
}

const MeetingItem = ({
  title,
  description,
  date,
  time,
  participants,
  link
}: MeetingItemProps) => {
  // Parse datetime
  const dateTimeString = `${date}T${time}`;
  const meetingDateTime = parseISO(dateTimeString);
  const now = new Date();
  
  // Check if meeting is within 10 minutes
  const isWithin10Min = isAfter(meetingDateTime, now) && 
                        isBefore(meetingDateTime, addMinutes(now, 10));
  
  // Format date for display
  const formattedDate = format(meetingDateTime, "dd 'de' MMMM', ' yyyy", { locale: ptBR });
  const formattedTime = format(meetingDateTime, "HH:mm");
  
  // Determine if meeting has passed
  const hasPassed = isAfter(now, meetingDateTime);

  const handleJoinMeeting = () => {
    if (link && isWithin10Min) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="border bg-card rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{participants} participantes</span>
            </div>
          </div>
        </div>
        
        <div>
          <Button
            variant={isWithin10Min ? "default" : "outline"}
            size="sm"
            className={cn(
              "flex items-center",
              hasPassed && "opacity-50 cursor-not-allowed",
              !isWithin10Min && !hasPassed && "text-muted-foreground"
            )}
            disabled={!isWithin10Min || hasPassed}
            onClick={handleJoinMeeting}
          >
            <Video size={14} className="mr-1" />
            {hasPassed ? "Concluída" : isWithin10Min ? "Entrar" : "Aguardando"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;
