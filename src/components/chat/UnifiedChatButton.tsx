
import React, { useState, useEffect } from "react";
import { MessageCircle, Users, MessageSquare, X, Maximize2, Minimize2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import type { PersonContact, GroupContact, Message } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  user_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_group_message: boolean;
  group_id?: string;
  created_at: string;
  read: boolean;
}

const UnifiedChatButton = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState("interno");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [internalContacts, setInternalContacts] = useState<PersonContact[]>([]);
  const [groupContacts, setGroupContacts] = useState<GroupContact[]>([]);
  const [externalContacts, setExternalContacts] = useState<PersonContact[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user, company, profile } = useAuth();
  
  // Utilizar contatos do WhatsApp se disponíveis
  const { contacts: whatsappContacts, sendMessage } = useWhatsApp();

  // Carregar contatos internos (colaboradores da mesma empresa)
  useEffect(() => {
    const loadInternalContacts = async () => {
      if (!user?.id || !company?.id) return;
      
      try {
        setLoadingContacts(true);
        
        // Buscar perfis da mesma empresa, exceto o usuário atual
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id)
          .neq('id', user.id);
          
        if (error) throw error;
        
        // Mapear para o formato de contatos
        const mappedContacts: PersonContact[] = (data || []).map(profile => ({
          id: profile.id,
          name: profile.name || profile.email,
          status: profile.status === 'active' ? 'online' : 'offline',
          avatar: profile.avatar || "",
          lastMessage: "Clique para iniciar uma conversa",
          unread: 0 // Será atualizado posteriormente
        }));
        
        setInternalContacts(mappedContacts);
      } catch (error) {
        console.error("Erro ao carregar contatos internos:", error);
        toast.error("Não foi possível carregar seus contatos");
      } finally {
        setLoadingContacts(false);
      }
    };
    
    loadInternalContacts();
  }, [user, company]);
  
  // Carregar grupos
  useEffect(() => {
    const loadGroups = async () => {
      if (!user?.id) return;
      
      try {
        // Exemplo de implementação - isso deverá ser adaptado quando a tabela de grupos for criada
        // Por enquanto, usamos dados mockados
        const mockGroups: GroupContact[] = [
          { id: "g1", name: "Equipe de Marketing", avatar: "", lastMessage: "Carlos: Campanha finalizada", unread: 0 },
          { id: "g2", name: "Projeto X", avatar: "", lastMessage: "Ana: Reunião às 14h", unread: 0 }
        ];
        
        setGroupContacts(mockGroups);
      } catch (error) {
        console.error("Erro ao carregar grupos:", error);
      }
    };
    
    loadGroups();
  }, [user]);
  
  // Mapear contatos do WhatsApp para o formato esperado
  useEffect(() => {
    if (whatsappContacts.length > 0) {
      const contacts: PersonContact[] = whatsappContacts.map(contact => ({
        id: contact.id,
        name: contact.name || contact.phone,
        status: 'online',
        avatar: "",
        lastMessage: "Toque para conversar",
        unread: 0
      }));
      
      setExternalContacts(contacts);
    } else {
      // Fallback para contatos externos
      setExternalContacts([
        { id: "e1", name: "Cliente ABC", status: "online", avatar: "", lastMessage: "Quando podemos agendar uma reunião?", unread: 1 },
        { id: "e2", name: "Fornecedor XYZ", status: "offline", avatar: "", lastMessage: "Orçamento enviado", unread: 0 }
      ]);
    }
  }, [whatsappContacts]);

  // Carregar mensagens quando um chat for selecionado
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat || !user?.id) return;
      
      try {
        setLoadingMessages(true);
        
        // Implementação futura: buscar mensagens do Supabase
        // Por enquanto, usando dados mockados
        const mockMessages: Message[] = [
          { id: "m1", sender: "other", text: "Olá, como está o projeto?", time: "10:30" },
          { id: "m2", sender: "me", text: "Está andando bem! Já concluímos a fase inicial.", time: "10:32" },
          { id: "m3", sender: "other", text: "Ótimo! Quando teremos a primeira entrega?", time: "10:35" }
        ];
        
        setChatMessages(mockMessages);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    loadMessages();
  }, [selectedChat, user]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && selectedChat) {
      setSelectedChat(null);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user?.id) return;
    
    if (activeTab === "externo" && selectedChat) {
      // Enviar mensagem do WhatsApp
      const contact = whatsappContacts.find(c => c.id === selectedChat);
      if (contact) {
        try {
          await sendMessage(contact.phone, message);
          
          // Adicionar mensagem localmente
          const newMessage: Message = {
            id: `temp-${Date.now()}`,
            sender: "me",
            text: message,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          
          setChatMessages(prev => [...prev, newMessage]);
          setMessage("");
          
          toast.success("Mensagem enviada com sucesso");
        } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
          toast.error("Não foi possível enviar sua mensagem");
        }
      }
    } else {
      // Enviar mensagem interna ou de grupo
      try {
        // Adicionar mensagem localmente enquanto implementamos o backend
        const newMessage: Message = {
          id: `temp-${Date.now()}`,
          sender: "me",
          text: message,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        setMessage("");
        
        toast.success("Mensagem enviada com sucesso");
        
        // Será implementada a persistência no Supabase
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        toast.error("Não foi possível enviar sua mensagem");
      }
    }
  };

  // Resetar seleção ao trocar de aba
  useEffect(() => {
    setSelectedChat(null);
    setChatMessages([]);
  }, [activeTab]);

  const getContacts = () => {
    switch (activeTab) {
      case "interno":
        return internalContacts;
      case "grupos":
        return groupContacts;
      case "externo":
        return externalContacts;
      default:
        return [];
    }
  };

  // Encontrar o contato selecionado em todos os tipos de contatos
  const selectedContact = [...internalContacts, ...groupContacts, ...externalContacts].find(c => c.id === selectedChat);
  
  // Adaptar tamanhos para mobile
  const buttonSize = isMobile ? "h-10 w-10" : "h-12 w-12";
  const iconSize = isMobile ? 18 : 24;
  const cardHeight = isMobile ? "h-[80vh]" : "h-[70vh]";
  
  // Função para iniciar um novo chat ou criar um novo grupo
  const handleCreateNewChat = () => {
    if (activeTab === "grupos") {
      // Implementação futura: modal para criar grupo
      toast({
        title: "Criar novo grupo",
        description: "Funcionalidade em desenvolvimento"
      });
    } else {
      // Implementação futura: modal para selecionar contato
      toast({
        title: "Iniciar nova conversa",
        description: "Funcionalidade em desenvolvimento"
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {isOpen && (
        <Card className={`flex flex-col overflow-hidden shadow-xl transition-all duration-300 ${
          isMaximized 
            ? "fixed inset-4 w-auto h-auto z-50" 
            : `w-80 ${cardHeight} max-h-[500px]`
        }`}>
          <div className="p-2 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={profile?.avatar || "/placeholder.svg"} alt="User Profile" />
                <AvatarFallback>{profile?.name?.substring(0, 2) || "AC"}</AvatarFallback>
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

          <Tabs defaultValue="interno" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b">
              <TabsList className="w-full">
                <TabsTrigger value="interno" className="flex-1 text-xs py-1.5">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Interno
                </TabsTrigger>
                <TabsTrigger value="grupos" className="flex-1 text-xs py-1.5">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Grupos
                </TabsTrigger>
                <TabsTrigger value="externo" className="flex-1 text-xs py-1.5">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Externo
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedChat && selectedContact ? (
                <>
                  <ChatHeader contact={selectedContact} onBack={() => setSelectedChat(null)} />
                  <ScrollArea className="flex-1 p-3">
                    {loadingMessages ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-sm text-muted-foreground">Carregando conversas...</p>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-sm text-muted-foreground">Nenhuma mensagem. Inicie uma conversa!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chatMessages.map(msg => (
                          <ChatMessage key={msg.id} message={msg} />
                        ))}
                      </div>
                    )}
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
                <div className="flex-1 flex flex-col">
                  <div className="p-2 flex justify-between items-center border-b">
                    <h3 className="text-sm font-medium">
                      {activeTab === "interno" ? "Colaboradores" : 
                       activeTab === "grupos" ? "Grupos" : "Contatos Externos"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCreateNewChat}
                      className="h-7 w-7 p-0"
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    {loadingContacts ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Carregando contatos...</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        <ChatList
                          contacts={getContacts()}
                          onSelectChat={(contact) => setSelectedChat(contact.id)}
                          selectedId={selectedChat}
                        />
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          </Tabs>
        </Card>
      )}

      <Button
        size="icon"
        onClick={toggleChat}
        className={`${buttonSize} rounded-full shadow-lg`}
      >
        {isOpen ? <X size={iconSize} /> : <MessageCircle size={iconSize} />}
      </Button>
    </div>
  );
};

export default UnifiedChatButton;
