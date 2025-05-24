
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Paperclip, Smile, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWhatsApp } from '@/contexts/WhatsAppContext';
import { toast } from 'sonner';

interface ProductionChatProps {
  projectId: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
  type: 'text' | 'file' | 'system';
}

export default function ProductionChat({ projectId }: ProductionChatProps) {
  const { user } = useAuth();
  const { sendMessage: sendWhatsAppMessage, connectionStatus } = useWhatsApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        user_id: 'system',
        user_name: 'Sistema',
        message: 'Chat do projeto iniciado. Todos os colaboradores podem participar da discussão.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        type: 'system'
      },
      {
        id: '2',
        user_id: user?.id || 'user1',
        user_name: user?.user_metadata?.name || 'Você',
        message: 'Olá! Vamos começar a trabalhar neste projeto.',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        type: 'text'
      },
      {
        id: '3',
        user_id: 'collaborator1',
        user_name: 'Maria Silva',
        message: 'Ótimo! Já revisei o briefing e tenho algumas ideias.',
        created_at: new Date(Date.now() - 900000).toISOString(),
        type: 'text'
      }
    ];
    setMessages(mockMessages);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      user_name: user.user_metadata?.name || 'Usuário',
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate automatic response
      const autoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user_id: 'collaborator1',
        user_name: 'Maria Silva',
        message: 'Recebi sua mensagem! Vou analisar e retorno em breve.',
        created_at: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const shareToWhatsApp = () => {
    if (connectionStatus === 'connected') {
      const projectUrl = `${window.location.origin}/production/project/${projectId}`;
      const message = `💼 Discussão do projeto em andamento!\n\nVeja a conversa: ${projectUrl}\n\n#ProjetoColaborativo`;
      
      toast.success('Mensagem enviada para o WhatsApp!');
      // In a real implementation, you'd integrate with WhatsApp API
    } else {
      toast.error('WhatsApp não conectado');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-medium">Chat do Projeto</h3>
          <span className="text-sm text-muted-foreground">
            {messages.filter(m => m.type !== 'system').length} mensagens
          </span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareToWhatsApp}
          disabled={connectionStatus !== 'connected'}
        >
          Compartilhar no WhatsApp
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma mensagem ainda. Inicie a conversa!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center py-2">
                      <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex gap-3 ${message.type === 'system' ? 'justify-center' : ''}`}>
                    {message.type !== 'system' && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={message.user_name} />
                        <AvatarFallback className="text-xs">
                          {message.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`flex-1 ${message.type === 'system' ? 'text-center' : ''}`}>
                      {message.type === 'system' ? (
                        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full inline-block">
                          {message.message}
                        </div>
                      ) : (
                        <Card className={`max-w-lg ${message.user_id === user?.id ? 'ml-auto' : ''}`}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{message.user_name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">MS</AvatarFallback>
                </Avatar>
                <Card className="max-w-lg">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">digitando...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          
          <Button variant="outline" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
