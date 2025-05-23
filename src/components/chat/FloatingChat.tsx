
import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, ChevronDown, Users, Globe, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

interface Conversation {
  id: string;
  name: string;
  type: 'internal' | 'group' | 'external';
  last_message?: string;
  updated_at: string;
  unread_count: number;
}

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('internal');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { user, profile } = useAuth();
  
  // Carregar conversas
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      try {
        // Na implementação real, carregaríamos conversas do Supabase
        // aqui usaremos dados mockados para exemplo
        const mockConversations: Conversation[] = [
          {
            id: '1',
            name: 'Equipe de Marketing',
            type: 'internal',
            last_message: 'Precisamos revisar a campanha',
            updated_at: new Date().toISOString(),
            unread_count: 2
          },
          {
            id: '2',
            name: 'Grupo de Desenvolvimento',
            type: 'group',
            last_message: 'O deploy está pronto',
            updated_at: new Date().toISOString(),
            unread_count: 0
          },
          {
            id: '3',
            name: 'Cliente XYZ',
            type: 'external',
            last_message: 'Obrigado pelo suporte',
            updated_at: new Date().toISOString(),
            unread_count: 1
          }
        ];
        
        setConversations(mockConversations);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar conversas:", error);
        setLoading(false);
      }
    };
    
    loadConversations();
  }, [user]);
  
  // Carregar mensagens ao selecionar conversa
  useEffect(() => {
    if (!activeConversation) return;
    
    const loadMessages = async () => {
      try {
        // Aqui carregaríamos mensagens do Supabase
        // Para exemplo, usaremos dados mockados
        const mockMessages: Message[] = [
          {
            id: '1',
            conversation_id: activeConversation,
            sender_id: 'other-user',
            content: 'Olá, como está o andamento do projeto?',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            sender_name: 'João Silva',
            sender_avatar: ''
          },
          {
            id: '2',
            conversation_id: activeConversation,
            sender_id: user?.id || '',
            content: 'Estamos avançando bem! O módulo principal está quase pronto.',
            created_at: new Date(Date.now() - 1800000).toISOString(),
            sender_name: profile?.name || 'Você',
            sender_avatar: profile?.avatar || ''
          },
          {
            id: '3',
            conversation_id: activeConversation,
            sender_id: 'other-user',
            content: 'Excelente! Quando teremos a próxima reunião de alinhamento?',
            created_at: new Date(Date.now() - 900000).toISOString(),
            sender_name: 'João Silva',
            sender_avatar: ''
          }
        ];
        
        setMessages(mockMessages);
        
        // Marcar mensagens como lidas
        setConversations(prev => 
          prev.map(conv => 
            conv.id === activeConversation 
              ? { ...conv, unread_count: 0 } 
              : conv
          )
        );
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };
    
    loadMessages();
  }, [activeConversation, user, profile]);
  
  // Enviar nova mensagem
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation || !user) return;
    
    try {
      const newMsg: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: activeConversation,
        sender_id: user.id,
        content: newMessage,
        created_at: new Date().toISOString(),
        sender_name: profile?.name || 'Você',
        sender_avatar: profile?.avatar || ''
      };
      
      // Adicionar mensagem localmente primeiro (otimista)
      setMessages(prev => [...prev, newMsg]);
      
      // Limpar campo de mensagem
      setNewMessage('');
      
      // Na implementação real, salvaríamos no Supabase
      // await supabase.from('chat_messages').insert([newMsg]);
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };
  
  // Filtrar conversas por tipo
  const filteredConversations = conversations.filter(conv => {
    switch(activeTab) {
      case 'internal': return conv.type === 'internal';
      case 'group': return conv.type === 'group';
      case 'external': return conv.type === 'external';
      default: return true;
    }
  });
  
  // Total de mensagens não lidas
  const totalUnread = conversations.reduce((total, conv) => total + conv.unread_count, 0);
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão flutuante */}
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 rounded-full shadow-lg"
        >
          <MessageSquare size={24} />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {totalUnread}
            </span>
          )}
        </Button>
      ) : (
        <div className="bg-background border rounded-lg shadow-xl w-80 md:w-96 h-[500px] flex flex-col">
          <div className="p-3 border-b flex justify-between items-center bg-primary text-primary-foreground">
            <h3 className="font-medium">Infinity Chat</h3>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary/90"
              >
                <ChevronDown size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary/90"
              >
                <X size={18} />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="internal" className="flex items-center gap-1">
                <Building2 size={14} />
                <span>Interno</span>
              </TabsTrigger>
              <TabsTrigger value="group" className="flex items-center gap-1">
                <Users size={14} />
                <span>Grupos</span>
              </TabsTrigger>
              <TabsTrigger value="external" className="flex items-center gap-1">
                <Globe size={14} />
                <span>Externo</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 flex">
              {!activeConversation ? (
                <TabsContent value={activeTab} className="flex-1 flex flex-col mt-0 border-r">
                  <div className="p-2 border-b">
                    <Input placeholder="Buscar..." className="h-8" />
                  </div>
                  <ScrollArea className="flex-1">
                    {loading ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Carregando conversas...</p>
                      </div>
                    ) : filteredConversations.length > 0 ? (
                      <div className="divide-y">
                        {filteredConversations.map(conversation => (
                          <div
                            key={conversation.id}
                            className={`
                              p-3 cursor-pointer hover:bg-muted/50 transition-colors
                              ${conversation.unread_count > 0 ? 'bg-muted/20' : ''}
                            `}
                            onClick={() => setActiveConversation(conversation.id)}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                              {conversation.unread_count > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 rounded-full">
                                  {conversation.unread_count}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.last_message || "Sem mensagens"}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada</p>
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-3 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      + Nova Conversa
                    </Button>
                  </div>
                </TabsContent>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h4 className="font-medium truncate">
                      {conversations.find(c => c.id === activeConversation)?.name || "Chat"}
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setActiveConversation(null)}
                      className="h-8 w-8"
                    >
                      <ChevronDown size={18} />
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                      {messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`
                            max-w-[80%] flex gap-2
                            ${message.sender_id === user?.id ? 'flex-row-reverse' : ''}
                          `}>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.sender_avatar || ""} />
                              <AvatarFallback>
                                {message.sender_name?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className={`
                                py-2 px-3 rounded-lg
                                ${message.sender_id === user?.id 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted text-foreground'}
                              `}>
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                    <Input 
                      placeholder="Digite sua mensagem..." 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="h-10"
                    />
                    <Button type="submit" size="icon" className="h-10 w-10">
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
