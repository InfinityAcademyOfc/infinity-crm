
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Phone, MessageSquare } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { WhatsAppContact } from "@/types/whatsapp";
import { cn } from "@/lib/utils";

interface ContactsSidebarProps {
  onSelectContact: (contact: WhatsAppContact) => void;
}

const ContactsSidebar = ({ onSelectContact }: ContactsSidebarProps) => {
  const { contacts, selectedContact, connectionStatus } = useWhatsApp();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const isConnected = connectionStatus === "connected";

  const getContactInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatPhone = (phone: string) => {
    // Simple phone formatting for display
    if (phone.startsWith("+55")) {
      const number = phone.replace("+55", "");
      if (number.length === 11) {
        return `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7)}`;
      }
    }
    return phone;
  };

  const getLastMessageTime = () => {
    // Mock last message time - in a real app this would come from message data
    const times = ["Agora", "5 min", "1h", "Ontem", "2 dias"];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getLastMessagePreview = (contact: WhatsAppContact) => {
    // Mock last message preview - in a real app this would come from message data
    const previews = [
      "Olá! Como posso ajudar?",
      "Obrigado pelo atendimento",
      "Vou verificar e retorno",
      "Perfeito, muito obrigado!",
      "Quando podemos conversar?"
    ];
    return previews[Math.floor(Math.random() * previews.length)];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Conversas</h2>
          <Button size="icon" variant="ghost" disabled={!isConnected}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={!isConnected}
          />
        </div>
        
        {/* Status */}
        <div className="mt-3 flex items-center gap-2">
          <div className={cn(
            "h-2 w-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
          <Badge variant="outline" className="ml-auto text-xs">
            {filteredContacts.length}
          </Badge>
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        {!isConnected ? (
          <div className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Conecte o WhatsApp para ver suas conversas
            </p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "Nenhum contato encontrado" : "Nenhuma conversa ainda"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
                  selectedContact?.id === contact.id && "bg-accent"
                )}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" alt={contact.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getContactInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {getLastMessageTime()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatPhone(contact.phone)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {getLastMessagePreview(contact)}
                  </p>
                </div>
                
                {/* Unread indicator */}
                {Math.random() > 0.7 && (
                  <div className="h-2 w-2 bg-primary rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ContactsSidebar;
