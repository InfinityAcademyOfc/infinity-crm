
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WhatsAppContact } from "@/types/whatsapp";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import ContactsList from "./ContactsList";

interface ContactsSidebarProps {
  onSelectContact: (contact: WhatsAppContact) => void;
}

const ContactsSidebar = ({ onSelectContact }: ContactsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { contacts, selectedContact } = useWhatsApp();

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Buscar conversas"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ContactsList 
          contacts={contacts || []}
          selectedContact={selectedContact}
          onSelectContact={onSelectContact}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default ContactsSidebar;
