
import React from "react";
import { WhatsAppContact } from "@/types/whatsapp";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactHeaderProps {
  contact: WhatsAppContact;
  onBack?: () => void;
}

const ContactHeader = ({ contact, onBack }: ContactHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-3 flex items-center border-b bg-muted/30">
      {isMobile && onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <div>
        <h3 className="font-semibold">
          {contact.name || contact.phone}
        </h3>
        {contact.name && (
          <p className="text-xs text-muted-foreground">{contact.phone}</p>
        )}
      </div>
    </div>
  );
};

export default ContactHeader;
