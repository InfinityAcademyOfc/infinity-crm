
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ContactHeader from "./conversation/ContactHeader";
import ChatMessages from "./conversation/ChatMessages";
import MessageInput from "./conversation/MessageInput";
import EmptyConversation from "./conversation/EmptyConversation";
import ContactsList from "./conversation/ContactsList";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

const WhatsAppConversations = () => {
  const { 
    currentSession, 
    messages, 
    contacts, 
    loadingMessages, 
    selectedContact,
    setSelectedContact,
    sendMessage
  } = useWhatsApp();
  
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  if (!currentSession) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Nenhuma sessão conectada. Conecte um número do WhatsApp para iniciar.
      </div>
    );
  }

  const handleSend = async () => {
    if (selectedContact && message.trim() !== "") {
      await sendMessage(selectedContact.phone, message);
      setMessage("");
    }
  };

  const filteredMessages = selectedContact 
    ? messages.filter(msg => 
        msg.number === selectedContact.phone || 
        (selectedContact.number && msg.number === selectedContact.number)
      )
    : [];

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Card className="col-span-1 overflow-hidden flex flex-col h-[80vh]">
        <CardContent className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>

        <div className="flex-1 overflow-y-auto">
          <ContactsList 
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
            searchQuery={searchQuery}
          />
        </div>
      </Card>

      <Card className="col-span-3 flex flex-col h-[80vh]">
        {selectedContact ? (
          <>
            <ContactHeader contact={selectedContact} />
            <div className="flex-1 overflow-y-auto p-4">
              <ChatMessages 
                messages={filteredMessages}
                loading={loadingMessages} 
              />
            </div>
            <MessageInput
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onSend={handleSend}
            />
          </>
        ) : (
          <EmptyConversation />
        )}
      </Card>
    </div>
  );
};

export default WhatsAppConversations;
