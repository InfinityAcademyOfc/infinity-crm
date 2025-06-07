
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
        
        // Using mock data since notifications table doesn't exist yet
        const mockNotifications: Notification[] = [
          {
            id: '1',
            user_id: user.id,
            type: 'task',
            title: 'Nova tarefa',
            message: 'Você tem uma nova tarefa',
            read: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            user_id: user.id,
            type: 'lead',
            title: 'Novo lead',
            message: 'Um novo lead foi adicionado',
            read: true,
            created_at: new Date(Date.now() - 60000).toISOString()
          }
        ];
        
        setNotifications(mockNotifications);
        const unread = mockNotifications.filter(notification => !notification.read).length;
        setUnreadCount(unread);
        
        // Uncomment when notifications table is created
        /*
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Erro ao carregar notificações:", error);
          return;
        }
        
        setNotifications(data as Notification[]);
        const unread = data.filter(item => !item.read).length;
        setUnreadCount(unread);
        */
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
  }, [user]);

  // Marcar notificação como lida
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Uncomment when notifications table is created
      /*
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      */
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      // Uncomment when notifications table is created
      /*
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id);
      */
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
      const newNotification: Notification = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        type,
        title,
        message,
        related_to: relatedTo,
        related_id: relatedId,
        read: false,
        created_at: new Date().toISOString()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Uncomment when notifications table is created
      /*
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type,
          title,
          message,
          related_to: relatedTo,
          related_id: relatedId,
          read: false,
        })
        .select();
        
      if (error) {
        console.error("Erro ao adicionar notificação:", error);
        return;
      }
      */
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
