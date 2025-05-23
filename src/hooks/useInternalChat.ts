
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface InternalConversation {
  id: string;
  participant_ids: string[];
  type: 'direct' | 'group';
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface InternalMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image';
  file_url: string | null;
  read_by: string[];
  created_at: string;
}

export const useInternalChat = () => {
  const { user, company } = useAuth();
  const [conversations, setConversations] = useState<InternalConversation[]>([]);
  const [messages, setMessages] = useState<Record<string, InternalMessage[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('internal_conversations')
        .select('*')
        .contains('participant_ids', [user.id])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      toast.error('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('internal_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: data || []
      }));
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const createConversation = async (participantIds: string[], title?: string, type: 'direct' | 'group' = 'direct') => {
    if (!user?.id || !company?.id) return;

    try {
      const { data, error } = await supabase
        .from('internal_conversations')
        .insert([{
          participant_ids: participantIds,
          type,
          title,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setConversations(prev => [data, ...prev]);
      toast.success('Conversa criada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast.error('Erro ao criar conversa');
      throw error;
    }
  };

  const sendMessage = async (conversationId: string, content: string, messageType: 'text' | 'file' | 'image' = 'text', fileUrl?: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('internal_messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          message_type: messageType,
          file_url: fileUrl || null,
          read_by: [user.id]
        }])
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), data]
      }));

      // Atualizar timestamp da conversa
      await supabase
        .from('internal_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
      throw error;
    }
  };

  const markAsRead = async (conversationId: string, messageId: string) => {
    if (!user?.id) return;

    try {
      const message = messages[conversationId]?.find(m => m.id === messageId);
      if (!message || message.read_by.includes(user.id)) return;

      const { error } = await supabase
        .from('internal_messages')
        .update({
          read_by: [...message.read_by, user.id]
        })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => ({
        ...prev,
        [conversationId]: prev[conversationId]?.map(m => 
          m.id === messageId 
            ? { ...m, read_by: [...m.read_by, user.id] }
            : m
        ) || []
      }));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Configurar tempo real para conversas e mensagens
  useEffect(() => {
    if (!user?.id) return;

    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'internal_conversations' }, 
        (payload) => {
          console.log('Alteração em conversa detectada:', payload);
          fetchConversations();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'internal_messages' }, 
        (payload) => {
          console.log('Nova mensagem detectada:', payload);
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as InternalMessage;
            setMessages(prev => ({
              ...prev,
              [newMessage.conversation_id]: [...(prev[newMessage.conversation_id] || []), newMessage]
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user]);

  return {
    conversations,
    messages,
    loading,
    createConversation,
    sendMessage,
    fetchMessages,
    markAsRead,
    refetch: fetchConversations
  };
};
