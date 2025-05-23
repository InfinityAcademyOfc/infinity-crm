
import React, { useState } from "react";
import { MessageCircle, Users, MessageSquare, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import type { PersonContact, GroupContact, Message } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

const UnifiedChatButton = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState("interno");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  
  // Utilizar contatos do WhatsApp se disponíveis
  const { contacts: whatsappContacts } = useWhatsApp();

  // Mapear contatos do WhatsApp para o formato esperado
  const externalContacts: PersonContact[] = whatsappContacts.map(contact => ({
    id: contact.id,
    name: contact.name || contact.phone,
    status: 'online',
    avatar: "",
    lastMessage: "Toque para conversar",
    unread: 0
  }));

  const internalContacts: PersonContact[] = [
    { id: "1", name: "Ana Silva", status: "online", avatar: "", lastMessage: "Podemos revisar o documento?", unread: 2 },
    { id: "2", name: "João Santos", status: "away", avatar: "", lastMessage: "Projeto concluído!", unread: 0 },
    { id: "3", name: "Maria Oliveira", status: "offline", avatar: "", lastMessage: "Vou enviar os relatórios amanhã", unread: 0 }
  ];

  const groupContacts: GroupContact[] = [
    { id: "g1", name: "Equipe de Marketing", avatar: "", lastMessage: "Carlos: Campanha finalizada", unread: 3 },
    { id: "g2", name: "Projeto X", avatar: "", lastMessage: "Ana: Reunião às 14h", unread: 0 }
  ];

  const mockMessages: Message[] = [
    { id: "m1", sender: "other", text: "Olá, como está o projeto?", time: "10:30" },
    { id: "m2", sender: "me", text: "Está andando bem! Já concluímos a fase inicial.", time: "10:32" },
    { id: "m3", sender: "other", text: "Ótimo! Quando teremos a primeira entrega?", time: "10:35" }
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && selectedChat) {
      setSelectedChat(null);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      });
      setMessage("");
    }
  };

  const getContacts = () => {
    switch (activeTab) {
      case "interno":
        return internalContacts;
      case "grupos":
        return groupContacts;
      case "externo":
        return externalContacts.length > 0 ? externalContacts : [
          { id: "e1", name: "Cliente ABC", status: "online", avatar: "", lastMessage: "Quando podemos agendar uma reunião?", unread: 1 },
          { id: "e2", name: "Fornecedor XYZ", status: "offline", avatar: "", lastMessage: "Orçamento enviado", unread: 0 }
        ];
      default:
        return [];
    }
  };

  const selectedContact = [...internalContacts, ...groupContacts, ...getContacts()].find(c => c.id === selectedChat);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {isOpen && (
        <Card className={`flex flex-col overflow-hidden shadow-lg transition-all duration-300 ${
          isMaximized 
            ? "fixed inset-4 w-auto h-auto z-50" 
            : "w-80 h-[70vh] max-h-[500px]"
        }`}>
          <div className="p-2 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg" alt="User Profile" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Chat</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={toggleMaximize}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={toggleChat}
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="interno" onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b">
              <TabsList className="w-full">
                <TabsTrigger value="interno" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Interno
                </TabsTrigger>
                <TabsTrigger value="grupos" className="flex-1">
                  <Users className="h-4 w-4 mr-1" />
                  Grupos
                </TabsTrigger>
                <TabsTrigger value="externo" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Externo
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedChat && selectedContact ? (
                <>
                  <ChatHeader contact={selectedContact} onBack={() => setSelectedChat(null)} />
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                      {mockMessages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} />
                      ))}
                    </div>
                  </ScrollArea>
                  <form onSubmit={handleSendMessage} className="border-t p-2 flex gap-2">
                    <Input
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">Enviar</Button>
                  </form>
                </>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    <ChatList
                      contacts={getContacts()}
                      onSelectChat={(contact) => setSelectedChat(contact.id)}
                      selectedId={selectedChat}
                    />
                  </div>
                </ScrollArea>
              )}
            </div>
          </Tabs>
        </Card>
      )}

      <Button
        size="icon"
        onClick={toggleChat}
        className="h-12 w-12 rounded-full shadow-lg"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </div>
  );
};

export default UnifiedChatButton;
