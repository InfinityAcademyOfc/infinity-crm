
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import QRCodeModal from "./QRCodeModal";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";
import {
  MessageSquare,
  Users,
  CircleDot,
  Search,
  MoreVertical,
  Filter,
  Archive,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Interface para mensagens
interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'me' | 'them';
  status?: 'sent' | 'delivered' | 'read';
}

// Interface para contatos
interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [activeConversation, setActiveConversation] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  
  const sessionId = "nova-sessao"; // fixo ou dinâmico no futuro

  // Dados simulados para contatos e conversas
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'Maria Silva',
      avatar: '/placeholder.svg',
      status: 'online',
      lastMessage: 'Olá, tudo bem?',
      lastTime: '10:42',
      unread: 3
    },
    {
      id: '2',
      name: 'João Carlos',
      avatar: '/placeholder.svg',
      status: 'online',
      lastMessage: 'Vamos marcar uma reunião amanhã?',
      lastTime: '09:15',
      unread: 0
    },
    {
      id: '3',
      name: 'Ana Marketing',
      avatar: '/placeholder.svg',
      status: 'offline',
      lastMessage: 'Enviando o relatório agora',
      lastTime: 'Ontem',
      unread: 1
    },
    {
      id: '4',
      name: 'Grupo de Vendas',
      avatar: '/placeholder.svg',
      status: 'online',
      lastMessage: 'Carlos: As metas deste mês foram atualizadas',
      lastTime: 'Ontem',
      unread: 5
    }
  ];

  // Mensagens simuladas
  const mockMessages: Record<string, Message[]> = {
    '1': [
      { id: '1', content: 'Olá, tudo bem?', timestamp: '10:40', sender: 'them' },
      { id: '2', content: 'Estou bem, e você?', timestamp: '10:41', sender: 'me', status: 'read' },
      { id: '3', content: 'Também! Queria saber se você tem um horário livre amanhã', timestamp: '10:42', sender: 'them' }
    ],
    '2': [
      { id: '1', content: 'Bom dia! Podemos conversar sobre o projeto?', timestamp: '09:10', sender: 'them' },
      { id: '2', content: 'Claro! Qual horário seria melhor?', timestamp: '09:12', sender: 'me', status: 'read' },
      { id: '3', content: 'Vamos marcar uma reunião amanhã?', timestamp: '09:15', sender: 'them' }
    ]
  };

  // Atualiza status periodicamente
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("VITE_API_URL não definida");

        const res = await fetch(`${apiUrl}/sessions/${sessionId}/status`);
        if (!res.ok) throw new Error("Erro ao buscar status");

        const data = await res.json();
        console.log("📶 Status atualizado:", data.status);
        setStatus(data.status as WhatsAppConnectionStatus);
      } catch (err) {
        console.error("Erro ao buscar status:", err);
        setStatus("error");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 7000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages[selectedChat] || []);
      const contact = mockContacts.find(c => c.id === selectedChat);
      setActiveConversation(contact || null);
    } else {
      setMessages([]);
      setActiveConversation(null);
    }
  }, [selectedChat]);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error("VITE_API_URL não definida");

      const res = await fetch(`${apiUrl}/sessions/${sessionId}/logout`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error("Erro ao desconectar");

      setStatus("not_started");
      toast({
        title: "Desconectado",
        description: "Sessão desconectada com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro ao desconectar",
        description: "Falha ao desconectar do WhatsApp.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleShowQrCode = () => setShowQrModal(true);

  const handleLogin = () => {
    setStatus("connected");
    setShowQrModal(false);
    toast({
      title: "Conectado",
      description: "Dispositivo conectado com sucesso.",
    });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: `new-${Date.now()}`,
      content: message,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simular resposta após 1 segundo
    setTimeout(() => {
      const response: Message = {
        id: `resp-${Date.now()}`,
        content: 'Ok, entendi! Vou verificar e retorno em breve.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'them'
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const renderContent = () => {
    if (status !== "connected") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">WhatsApp não conectado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conecte seu WhatsApp para começar a usar todas as funcionalidades.
            </p>
            <Button onClick={handleShowQrCode}>Conectar WhatsApp</Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full border rounded-lg overflow-hidden">
        {/* Painel lateral - sempre visível */}
        <div className="w-80 border-r flex flex-col bg-background">
          {/* Cabeçalho do painel lateral */}
          <div className="p-3 bg-muted/40 flex items-center justify-between">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Perfil" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <MessageSquare size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical size={20} />
              </Button>
            </div>
          </div>
          
          {/* Barra de pesquisa */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Pesquisar ou começar uma nova conversa" 
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* Filtros e Arquivados */}
          <div className="p-2 flex items-center justify-between border-y border-muted/40 bg-background">
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
              <Filter size={14} />
              <span>Filtros</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
              <Archive size={14} />
              <span>Arquivados</span>
            </Button>
          </div>

          {/* Navegação por tabs - Conversas, Grupos, Status, etc. */}
          <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col overflow-hidden">
            <TabsList className="justify-start h-auto py-1 px-2 border-b bg-background">
              <TabsTrigger value="chats" className="text-xs py-1 px-2 data-[state=active]:border-b-2 border-primary">
                <MessageSquare size={16} className="mr-1" />
                Conversas
              </TabsTrigger>
              <TabsTrigger value="groups" className="text-xs py-1 px-2">
                <Users size={16} className="mr-1" />
                Grupos
              </TabsTrigger>
              <TabsTrigger value="status" className="text-xs py-1 px-2">
                <CircleDot size={16} className="mr-1" />
                Status
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-grow">
              <TabsContent value="chats" className="m-0 p-0 h-full">
                <div className="space-y-1 p-1">
                  {mockContacts.map(contact => (
                    <div 
                      key={contact.id}
                      className={`flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-muted ${selectedChat === contact.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedChat(contact.id)}
                    >
                      <Avatar className="relative h-12 w-12">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        {contact.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                        )}
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-medium text-sm truncate">{contact.name}</span>
                          <span className="text-xs text-muted-foreground">{contact.lastTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                          {contact.unread > 0 && (
                            <Badge variant="default" className="rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {contact.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="m-0 p-2 h-full">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Seus grupos</h3>
                  <p className="text-xs text-muted-foreground">Crie e gerencie grupos para comunicação em equipe</p>
                  <Button className="w-full" size="sm">Criar novo grupo</Button>
                </div>
              </TabsContent>

              <TabsContent value="status" className="m-0 p-2 h-full">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Status</h3>
                  <p className="text-xs text-muted-foreground">Compartilhe atualizações temporárias com seus contatos</p>
                  <Button className="w-full" size="sm">Atualizar status</Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Área principal da conversa */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Cabeçalho da conversa */}
            <div className="p-3 bg-muted/40 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeConversation?.avatar} alt={activeConversation?.name} />
                  <AvatarFallback>{activeConversation?.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{activeConversation?.name}</div>
                  {activeConversation?.status === 'online' && (
                    <div className="text-xs text-green-500">online</div>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Search size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={20} />
                </Button>
              </div>
            </div>
            
            {/* Área de mensagens */}
            <ScrollArea className="flex-1 py-4 px-6 bg-[#e5ddd5] dark:bg-gray-900">
              <div className="space-y-4 min-h-full">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === 'me' ? 'bg-[#dcf8c6] dark:bg-[#005c4b]' : 'bg-white dark:bg-gray-700'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1 mt-1">
                        <span>{msg.timestamp}</span>
                        {msg.status && msg.sender === 'me' && (
                          <span className={msg.status === 'read' ? 'text-blue-500' : ''}>
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Área de input */}
            <div className="p-3 flex items-center gap-2 bg-background">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
              </Button>
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </Button>
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite uma mensagem"
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="ghost" size="icon" onClick={handleSendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal"><path d="m3 3 3 9-3 9 19-9Z"/><path d="M6 12h16"/></svg>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">WhatsApp Web</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Selecione uma conversa para começar a trocar mensagens ou crie uma nova conversa.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">WhatsApp Web</h2>
        <div className="flex items-center gap-2">
          {status === "connected" && (
            <Button variant="outline" size="sm" onClick={handleLogout}>Desconectar</Button>
          )}
          {status !== "connected" && (
            <Button variant="default" size="sm" onClick={handleShowQrCode}>Conectar WhatsApp</Button>
          )}
        </div>
      </div>

      <Card className="p-0 h-[70vh]">
        {renderContent()}
      </Card>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={sessionId}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppIntegration;
