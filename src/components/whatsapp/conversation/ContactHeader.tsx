
import { WhatsAppContact } from "@/types/whatsapp";

interface ContactHeaderProps {
  contact: WhatsAppContact;
}

const ContactHeader = ({ contact }: ContactHeaderProps) => {
  return (
    <div className="p-3 border-b bg-muted/30 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
        {(contact.name || contact.number || contact.phone || "")?.charAt(0).toUpperCase()}
      </div>
      <div>
        <h4 className="font-medium">
          {contact.name || contact.number || contact.phone}
        </h4>
        <p className="text-xs text-muted-foreground">online</p>
      </div>
    </div>
  );
};

export default ContactHeader;
