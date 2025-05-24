
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Phone, Video, MoreVertical, Search } from "lucide-react";
import { WhatsAppContact } from "@/types/whatsapp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactHeaderProps {
  contact: WhatsAppContact;
  onBack?: () => void;
}

const ContactHeader = ({ contact, onBack }: ContactHeaderProps) => {
  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatPhone = (phone: string) => {
    if (phone.startsWith("+55")) {
      const number = phone.replace("+55", "");
      if (number.length === 11) {
        return `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7)}`;
      }
    }
    return phone;
  };

  const getOnlineStatus = () => {
    // Mock online status - in real app this would come from WhatsApp API
    const statuses = ["online", "visto por último há 5 min", "visto por último hoje às 14:30"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleCall = () => {
    // In a real app, this would initiate a WhatsApp call
    window.open(`https://wa.me/${contact.phone.replace('+', '')}`, '_blank');
  };

  const handleVideoCall = () => {
    // In a real app, this would initiate a WhatsApp video call
    window.open(`https://wa.me/${contact.phone.replace('+', '')}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <Avatar className="h-10 w-10">
        <AvatarImage src="" alt={contact.name} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {getContactInitials(contact.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{contact.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatPhone(contact.phone)}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {getOnlineStatus()}
          </span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCall}
          className="h-9 w-9"
        >
          <Phone className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleVideoCall}
          className="h-9 w-9"
        >
          <Video className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ver contato</DropdownMenuItem>
            <DropdownMenuItem>Mídia, links e docs</DropdownMenuItem>
            <DropdownMenuItem>Pesquisar</DropdownMenuItem>
            <DropdownMenuItem>Mensagens temporárias</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Bloquear contato
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ContactHeader;
