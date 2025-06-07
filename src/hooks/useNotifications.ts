
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { realTimeService } from '@/services/realTimeService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
  expires_at?: string;
}

export const useNotifications = () => {
  const { user, company } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const validNotifications = (data || []).filter(notification => {
        if (!notification.expires_at) return true;
        return new Date(notification.expires_at) > new Date();
      });

      setNotifications(validNotifications);
      setUnreadCount(validNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const createNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    link?: string,
    expiresIn?: number // minutos
  ) => {
    if (!user?.id) return;

    try {
      const expiresAt = expiresIn 
        ? new Date(Date.now() + expiresIn * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          company_id: company?.id,
          title,
          message,
          type,
          link,
          expires_at: expiresAt,
          read: false
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  };

  const notifySystemEvent = async (title: string, message: string) => {
    await createNotification(title, message, 'info', undefined, 60); // Expira em 1 hora
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();

      // Configurar real-time para notificações
      const unsubscribe = realTimeService.subscribe('notifications', (event) => {
        if (event.type === 'INSERT' && event.new?.user_id === user.id) {
          setNotifications(prev => [event.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      });

      return unsubscribe;
    }
  }, [user?.id]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    notifySystemEvent,
    refetch: fetchNotifications
  };
};
