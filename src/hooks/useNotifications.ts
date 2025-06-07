
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  company_id?: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  link?: string;
  created_at: string;
  expires_at?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, company } = useAuth();

  // Função para buscar notificações
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Buscar notificações do usuário que não expiraram ou que não têm data de expiração
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar notificações:", error);
        throw error;
      }
      
      setNotifications(data as Notification[]);
      const unread = data.filter(item => !item.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar notificações iniciais
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    
    // Configurar subscription para atualizações em tempo real
    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        payload => {
          console.log('Notificação atualizada:', payload);
          fetchNotifications();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [user, fetchNotifications]);

  // Marcar notificação como lida
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      // Atualizar otimisticamente na UI
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Erro ao marcar notificação como lida:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      toast.error("Não foi possível atualizar a notificação");
      
      // Reverter mudança otimista em caso de erro
      fetchNotifications();
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      // Atualizar otimisticamente na UI
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .is('read', false); // Atualiza apenas não-lidas
        
      if (error) {
        console.error("Erro ao marcar todas notificações como lidas:", error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
      toast.error("Não foi possível atualizar as notificações");
      
      // Reverter mudança otimista em caso de erro
      fetchNotifications();
      throw error;
    }
  };

  // Adicionar uma nova notificação
  const addNotification = async (
    type: string,
    title: string,
    message: string,
    link?: string,
    expiresAt?: Date
  ) => {
    if (!user) return;
    
    try {
      const newNotification: Omit<Notification, 'id' | 'created_at' | 'read'> = {
        user_id: user.id,
        company_id: company?.id,
        type,
        title,
        message,
        link,
        expires_at: expiresAt?.toISOString()
      };
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('notifications')
        .insert({...newNotification, read: false})
        .select()
        .single();
        
      if (error) {
        console.error("Erro ao adicionar notificação:", error);
        throw error;
      }
      
      // Atualizar localmente (a subscription já deve atualizar automaticamente)
      return data as Notification;
    } catch (error) {
      console.error("Erro ao adicionar notificação:", error);
      toast.error("Não foi possível criar a notificação");
      throw error;
    }
  };

  // Criar uma utilidade para adicionar uma notificação de sistema
  const notifySystemEvent = async (
    title: string, 
    message: string, 
    moduleLink?: string
  ) => {
    return addNotification('system', title, message, moduleLink);
  };

  return { 
    notifications, 
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification,
    notifySystemEvent,
    fetchNotifications
  };
};
