
import { useState } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  ChevronLeft,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: 'me' | 'them';
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    avatar: "/placeholder.svg",
    lastMessage: "Olá, gostaria de saber mais sobre...",
    time: "12:30",
    unread: 2
  },
  {
    id: "2",
    name: "Maria Oliveira",
    avatar: "/placeholder.svg",
    lastMessage: "Podemos agendar para quinta-feira?",
    time: "Ontem",
    unread: 0
  },
  {
    id: "3",
    name: "Carlos Almeida",
    avatar: "/placeholder.svg",
    lastMessage: "Obrigado pelo atendimento!",
    time: "Seg",
    unread: 0
  },
  {
    id: "4",
    name: "Ana Santos",
    avatar: "/placeholder.svg",
    lastMessage: "Vou verificar e te retorno",
    time: "17/03",
    unread: 0
  },
  {
    id: "5",
    name: "Roberto Ferreira",
    avatar: "/placeholder.svg",
    lastMessage: "Qual o horário de funcionamento?",
    time: "15/03",
    unread: 1
  }
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    { id: "1-1", content: "Olá, gostaria de saber mais sobre os serviços de consultoria", timestamp: "11:45", sender: "them" },
    { id: "1-2", content: "Claro! Temos consultoria em marketing digital, gestão de projetos e desenvolvimento de negócios. Em qual área você tem interesse?", timestamp: "11:50", sender: "me" },
    { id: "1-3", content: "Estou interessado em marketing digital", timestamp: "12:05", sender: "them" },
    { id: "1-4", content: "Perfeito! Nosso pacote de marketing digital inclui gestão de redes sociais, SEO e campanhas pagas. Podemos agendar uma reunião?", timestamp: "12:15", sender: "me" },
    { id: "1-5", content: "Sim, seria ótimo! Você tem disponibilidade esta semana?", timestamp: "12:20", sender: "them" },
    { id: "1-6", content: "Tenho sim! Que tal na quarta às 14h?", timestamp: "12:25", sender: "me" },
    { id: "1-7", content: "Olá, gostaria de saber mais sobre...", timestamp: "12:30", sender: "them" },
  ],
  "2": [
    { id: "2-1", content: "Bom dia! Estou entrando em contato para falar sobre nossa reunião", timestamp: "09:30", sender: "them" },
    { id: "2-2", content: "Bom dia, Maria! Como posso ajudar?", timestamp: "09:45", sender: "me" },
    { id: "2-3", content: "Precisamos reagendar nossa reunião de amanhã", timestamp: "10:00", sender: "them" },
    { id: "2-4", content: "Sem problemas. Tem alguma data em mente?", timestamp: "10:05", sender: "me" },
    { id: "2-5", content: "Podemos agendar para quinta-feira?", timestamp: "10:15", sender: "them" },
  ],
  "3": [
    { id: "3-1", content: "Olá, recebi o relatório que você enviou", timestamp: "14:10", sender: "them" },
    { id: "3-2", content: "Oi Carlos! O que achou?", timestamp: "14:15", sender: "me" },
    { id: "3-3", content: "Está muito completo, exatamente o que precisávamos", timestamp: "14:30", sender: "them" },
    { id: "3-4", content: "Que bom que gostou! Precisamos discutir algum ponto específico?", timestamp: "14:40", sender: "me" },
    { id: "3-5", content: "Não, está tudo bem explicado. Obrigado pelo atendimento!", timestamp: "15:00", sender: "them" },
  ],
  "4": [
    { id: "4-1", content: "Boa tarde, preciso de informações sobre o produto X", timestamp: "13:20", sender: "them" },
    { id: "4-2", content: "Boa tarde, Ana! O produto X tem as seguintes características...", timestamp: "13:30", sender: "me" },
    { id: "4-3", content: "E quanto ao preço e prazos de entrega?", timestamp: "13:45", sender: "them" },
    { id: "4-4", content: "O valor é R$ 1.500 e o prazo de entrega é de 7 dias úteis", timestamp: "14:00", sender: "me" },
    { id: "4-5", content: "Entendi. Preciso consultar minha equipe", timestamp: "14:15", sender: "them" },
    { id: "4-6", content: "Vou verificar e te retorno", timestamp: "14:20", sender: "me" },
  ],
  "5": [
    { id: "5-1", content: "Olá, vocês estão funcionando no feriado?", timestamp: "16:05", sender: "them" },
    { id: "5-2", content: "Olá Roberto! Não, estaremos fechados no feriado", timestamp: "16:10", sender: "me" },
    { id: "5-3", content: "Entendi. E nos outros dias?", timestamp: "16:20", sender: "them" },
    { id: "5-4", content: "Funcionamos de segunda a sexta, das 9h às 18h", timestamp: "16:25", sender: "me" },
    { id: "5-5", content: "Qual o horário de funcionamento?", timestamp: "16:30", sender: "them" },
  ]
};

const WhatsAppChat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: `${selectedContact.id}-${Date.now()}`,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me'
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...prev[selectedContact.id], newMessage]
    }));
    
    setMessage("");
    
    // Simulate a response after a delay (for demo purposes)
    setTimeout(() => {
      const responseMessage: Message = {
        id: `${selectedContact.id}-${Date.now() + 1}`,
        content: "Obrigado pela mensagem! Entrarei em contato em breve.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'them'
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...prev[selectedContact.id], responseMessage]
      }));
      
      toast({
        title: "Nova mensagem",
        description: `${selectedContact.name}: Obrigado pela mensagem! Entrarei em contato em breve.`,
      });
    }, 3000);
  };

  return (
    <div className="flex h-full border rounded-md overflow-hidden bg-white dark:bg-gray-800">
      {/* Contact list sidebar */}
      <div className={`w-full md:w-80 border-r flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 flex items-center justify-between">
          <h3 className="font-medium">Conversas</h3>
          <Button variant="ghost" size="icon">
            <Search size={18} />
          </Button>
        </div>
        <div className="p-2">
          <Input placeholder="Pesquisar ou começar nova conversa" className="text-sm" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                selectedContact?.id === contact.id ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium truncate">{contact.name}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="ml-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
        {selectedContact ? (
          <>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden mr-1" onClick={() => setSelectedContact(null)}>
                <ChevronLeft size={18} />
              </Button>
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">{selectedContact.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Search size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5] dark:bg-gray-900">
              {messages[selectedContact.id]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`whatsapp-message ${
                    msg.sender === 'me' ? 'whatsapp-message-sent' : 'whatsapp-message-received'
                  }`}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 text-right mt-1">
                    {msg.timestamp}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-gray-100 dark:bg-gray-700 flex items-center">
              <Button variant="ghost" size="icon">
                <Smile size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Paperclip size={20} />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite uma mensagem"
                className="mx-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="ghost" size="icon" onClick={handleSendMessage}>
                <Send size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">WhatsApp Web</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Selecione um contato para iniciar ou continuar uma conversa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat;
