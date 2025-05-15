
import React from "react";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Participant {
  name: string;
  avatar?: string;
}

interface MeetingProps {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: Participant[];
  onJoin: (meeting: any) => void;
}

const MeetingCard = ({ meeting, onJoin }: { meeting: MeetingProps, onJoin: (meeting: MeetingProps) => void }) => {
  return (
    <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-base font-medium">{meeting.title}</h3>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{meeting.time} ({meeting.duration})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{meeting.participants.length} participantes</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {meeting.participants.slice(0, 3).map((participant, index) => (
                <Avatar key={index} className="border-2 border-white dark:border-gray-900 w-7 h-7">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {meeting.participants.length > 3 && (
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 text-xs font-medium">
                  +{meeting.participants.length - 3}
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => onJoin(meeting)}
              size="sm"
              className="flex items-center gap-1 h-8 text-xs"
            >
              <Video size={14} />
              Entrar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
