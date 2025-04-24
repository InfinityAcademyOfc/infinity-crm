
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ContactType } from "./types";

interface ChatHeaderProps {
  contact: ContactType;
  onBack: () => void;
}

const ChatHeader = ({ contact, onBack }: ChatHeaderProps) => {
  return (
    <div className="border-b p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {contact?.avatar ? (
            <AvatarImage src={contact.avatar} />
          ) : (
            <AvatarFallback>
              {contact?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-medium text-sm">{contact?.name}</div>
          {'status' in contact && (
            <div className="text-xs flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${
                contact.status === 'online' ? 'bg-green-500' : 
                contact.status === 'away' ? 'bg-yellow-500' : 
                'bg-gray-500'
              }`} />
              {contact.status === 'online' ? 'Online' : 
               contact.status === 'away' ? 'Ausente' : 
               'Offline'}
            </div>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronDown size={16} />
      </Button>
    </div>
  );
};

export default ChatHeader;
