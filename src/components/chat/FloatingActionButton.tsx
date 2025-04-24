
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  X, 
  Minimize2, 
  Maximize2,
  Users,
  MessageSquare,
  Phone
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFloatingAction } from '@/hooks/use-floating-action';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  unread: number;
}

const mockMessages: Message[] = [
  {
    id: 'm1',
    content: 'Olá, tudo bem? Precisamos revisar o projeto.',
    sender: {
      id: 'user1',
      name: 'Ana Silva',
      avatar: '/avatar-placeholder.jpg'
    },
    timestamp: new Date(2023, 3, 15, 14, 30)
  },
  {
    id: 'm2',
    content: 'Claro! O que você precisa revisar especificamente?',
    sender: {
      id: 'me',
      name: 'Eu',
      avatar: '/avatar-placeholder.jpg'
    },
    timestamp: new Date(2023, 3, 15, 14, 35)
  },
  {
    id: 'm3',
    content: 'Precisamos verificar o cronograma e atualizar as tarefas do sprint.',
    sender: {
      id: 'user1',
      name: 'Ana Silva',
      avatar: '/avatar-placeholder.jpg'
    },
    timestamp: new Date(2023, 3, 15, 14, 40)
  }
];

const mockContacts: ChatContact[] = [
  {
    id: 'user1',
    name: 'Ana Silva',
    avatar: '/avatar-placeholder.jpg',
    status: 'online',
    lastMessage: 'Precisamos verificar o cronograma e atualizar as tarefas do sprint.',
    unread: 1
  },
  {
    id: 'user2',
    name: 'Carlos Mendes',
    avatar: '/avatar-placeholder.jpg',
    status: 'away',
    lastMessage: 'Você viu os novos requisitos?',
    unread: 3
  },
  {
    id: 'user3',
    name: 'Mariana Costa',
    avatar: '/avatar-placeholder.jpg',
    status: 'offline',
    lastMessage: 'Vamos agendar uma reunião para amanhã?',
    unread: 0
  }
];

const mockGroups: ChatContact[] = [
  {
    id: 'group1',
    name: 'Equipe de Desenvolvimento',
    avatar: undefined,
    status: 'online',
    lastMessage: 'João: Alguém pode revisar meu PR?',
    unread: 5
  },
  {
    id: 'group2',
    name: 'Marketing',
    avatar: undefined,
    status: 'online',
    lastMessage: 'Ana: Precisamos finalizar a campanha até sexta',
    unread: 0
  }
];

const FloatingActionButton = () => {
  const {
    isOpen,
    isFullScreen,
    activeTab,
    chatHeight,
    chatWidth,
    isResizing,
    setActiveTab,
    toggleOpen,
    toggleFullScreen,
    handleResizing
  } = useFloatingAction({ defaultOpen: false, defaultTab: 'chats' });

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: `m${Date.now()}`,
        content: newMessage,
        sender: {
          id: 'me',
          name: 'Eu',
          avatar: '/avatar-placeholder.jpg'
        },
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleOpen}
        variant="default"
        size="icon"
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-50 bg-primary text-white hover:bg-primary/90"
      >
        <MessageCircle size={24} />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed transition-all duration-300 z-50 shadow-lg ${
        isFullScreen
          ? 'inset-4 rounded-lg'
          : `bottom-8 right-8 rounded-lg ${isResizing ? 'transition-none' : ''}`
      }`}
      style={
        !isFullScreen
          ? {
              height: `${chatHeight}px`,
              width: `${chatWidth}px`
            }
          : undefined
      }
    >
      <div className="flex flex-col h-full">
        <div className="border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-primary" />
            <span className="font-medium">Chat</span>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleOpen}
            >
              <X size={14} />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 p-1 mx-3 mt-2">
            <TabsTrigger value="chats" className="text-xs py-1">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs py-1">
              <Users className="h-3.5 w-3.5 mr-1" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="calls" className="text-xs py-1">
              <Phone className="h-3.5 w-3.5 mr-1" />
              Chamadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 flex flex-col mt-2 overflow-hidden">
            {selectedContact ? (
              <div className="flex flex-col h-full">
                <div className="border-b p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {selectedContact.avatar ? (
                        <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                      ) : (
                        <AvatarFallback>{selectedContact.name.substring(0, 2)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{selectedContact.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedContact.status === 'online' ? 'Online' : 
                         selectedContact.status === 'away' ? 'Ausente' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                    onClick={() => setSelectedContact(null)}
                  >
                    Voltar
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender.id === 'me' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender.id === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">Enviar</Button>
                </form>
              </div>
            ) : (
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {mockContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectContact(contact)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          {contact.avatar ? (
                            <AvatarImage src={contact.avatar} alt={contact.name} />
                          ) : (
                            <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                          )}
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                            contact.status === 'online'
                              ? 'bg-green-500'
                              : contact.status === 'away'
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-sm truncate">{contact.name}</div>
                          {contact.unread > 0 && (
                            <div className="bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs">
                              {contact.unread}
                            </div>
                          )}
                        </div>
                        {contact.lastMessage && (
                          <div className="text-xs text-muted-foreground truncate">
                            {contact.lastMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="groups" className="flex-1 overflow-hidden mt-2">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {mockGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectContact(group)}
                  >
                    <Avatar className="h-10 w-10">
                      {group.avatar ? (
                        <AvatarImage src={group.avatar} alt={group.name} />
                      ) : (
                        <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm truncate">{group.name}</div>
                        {group.unread > 0 && (
                          <div className="bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs">
                            {group.unread}
                          </div>
                        )}
                      </div>
                      {group.lastMessage && (
                        <div className="text-xs text-muted-foreground truncate">
                          {group.lastMessage}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="calls" className="flex-1 overflow-hidden flex items-center justify-center mt-2">
            <div className="text-center p-4">
              <Phone className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Sem chamadas recentes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Inicie uma nova chamada com seus contatos
              </p>
              <Button>Nova chamada</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default FloatingActionButton;
