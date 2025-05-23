
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_to?: string;
  related_id?: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Carregar notificações iniciais
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        
        if (data) {
          setNotifications(data);
          const unread = data.filter(notification => !notification.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Inscrever-se para atualizações em tempo real
    const notificationsSubscription = supabase
      .channel('notifications-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(notificationsSubscription);
    };
  }, [user]);

  // Marcar notificação como lida
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
    }
  };

  // Adicionar uma nova notificação
  const addNotification = async (
    type: string,
    title: string,
    message: string,
    relatedTo?: string,
    relatedId?: string
  ) => {
    if (!user) return;
    
    try {
      const notification = {
        user_id: user.id,
        type,
        title,
        message,
        related_to: relatedTo,
        related_id: relatedId,
        read: false,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('notifications')
        .insert([notification]);
      
      if (error) throw error;
      
      // A atualização será feita pela inscrição em tempo real
    } catch (error) {
      console.error("Erro ao adicionar notificação:", error);
    }
  };

  return { 
    notifications, 
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification
  };
};
