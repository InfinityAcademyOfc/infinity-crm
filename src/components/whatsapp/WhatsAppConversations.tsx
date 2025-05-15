
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

interface WhatsAppConversationsProps {
  sessionId: string;
}

const WhatsAppConversations = ({ sessionId }: WhatsAppConversationsProps) => {
  const { 
    selectedContact, 
    setSelectedContact,
    contacts,
    messages,
    loadingMessages,
    sendMessage 
  } = useWhatsApp();
  
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText("");
    }
  };

  // Format timestamp for messages
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "HH:mm");
    } catch (error) {
      return "";
    }
  };

  if (!selectedContact) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          <h2 className="font-medium">Conversas</h2>
        </div>
        
        <div className="p-4">
          <div className="border rounded-md p-6 text-center">
            <h3 className="font-medium text-lg mb-2">Selecione um contato</h3>
            <p className="text-muted-foreground text-sm">
              Escolha um contato da lista para iniciar uma conversa
            </p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col space-y-2 p-4">
          {contacts.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-muted-foreground">Nenhum contato encontrado.</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center space-x-4 p-2 rounded-md hover:bg-secondary cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <Avatar className="h-10 w-10">
                  <div className="bg-primary/10 text-primary font-medium h-full w-full flex items-center justify-center">
                    {contact.name?.charAt(0) || contact.number?.charAt(0) || "?"}
                  </div>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contact.name || contact.number || "Desconhecido"}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.number || contact.phone || ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-4 py-3 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 md:hidden"
          onClick={() => setSelectedContact(null)}
        >
          &larr;
        </Button>
        <Avatar className="h-9 w-9 mr-2">
          <div className="bg-primary/10 text-primary font-medium h-full w-full flex items-center justify-center">
            {selectedContact.name?.charAt(0) || selectedContact.number?.charAt(0) || "?"}
          </div>
        </Avatar>
        <div>
          <h2 className="font-medium leading-none">
            {selectedContact.name || selectedContact.number || "Desconhecido"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {selectedContact.number || selectedContact.phone || ""}
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {loadingMessages ? (
            <div className="flex justify-center my-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Nenhuma mensagem no histórico.</p>
              <p className="text-sm text-muted-foreground mt-1">Envie uma mensagem para iniciar a conversa</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from_me ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.from_me
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <div>{message.message}</div>
                  <div className={`text-xs mt-1 ${message.from_me ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {formatTimestamp(message.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppConversations;
