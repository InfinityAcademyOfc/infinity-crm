
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import ChatMessages from "./conversation/ChatMessages";
import ContactsSidebar from "./conversation/ContactsSidebar";
import { sendMessage } from "@/lib/api";
import ContactHeader from "./conversation/ContactHeader";

export default function WhatsAppConversations() {
  const {
    selectedContact,
    setSelectedContact,
    messages,
    loadingMessages,
    sessionId,
    fetchMessages
  } = useWhatsApp();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedContact && sessionId) {
      fetchMessages(selectedContact.phone, sessionId);
    }
  }, [selectedContact, sessionId, fetchMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() && selectedContact && sessionId) {
      await sendMessage(sessionId, selectedContact.phone, message);
      setMessage("");
    }
  };

  // Modified to safely filter messages
  const filteredMessages = selectedContact
    ? messages.filter(
        (msg) => {
          const msgNumber = msg.number;
          const contactNumber = selectedContact.phone;
          const fromNumber = msg.from || ''; // Safely access with default
          const toNumber = msg.to || '';     // Safely access with default
          
          return msgNumber === contactNumber || 
                 fromNumber === contactNumber || 
                 toNumber === contactNumber;
        }
      )
    : [];

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <ContactsSidebar onSelectContact={setSelectedContact} />
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            <ContactHeader contact={selectedContact} />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Nenhuma mensagem nesta conversa ainda.
                </p>
              ) : (
                <ChatMessages messages={filteredMessages} />
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={`Mensagem para ${selectedContact.name || selectedContact.phone}`}
              />
              <Button onClick={handleSend}>Enviar</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Selecione um contato</p>
          </div>
        )}
      </div>
    </div>
  );
}
