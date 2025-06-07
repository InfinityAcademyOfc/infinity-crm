
import { useState, useEffect } from 'react';
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

  // Carregar notificações iniciais
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
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
          return;
        }
        
        setNotifications(data as Notification[]);
        const unread = data.filter(item => !item.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Erro ao carregar notificações:", error);
        
        // Fallback para dados locais em caso de erro
        const mockNotifications: Notification[] = [
          {
            id: '1',
            user_id: user.id,
            title: 'Bem-vindo ao CRM',
            message: 'Explore as funcionalidades disponíveis',
            type: 'welcome',
            read: false,
            created_at: new Date().toISOString()
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(1);
      } finally {
        setLoading(false);
      }
    };

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
  }, [user]);

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
    } catch (error) {
      console.error("Erro ao marcar todas notificações como lidas:", error);
      toast.error("Não foi possível atualizar as notificações");
      
      // Reverter mudança otimista em caso de erro
      fetchNotifications();
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
      const newNotification: Omit<Notification, 'id' | 'created_at'> = {
        user_id: user.id,
        company_id: company?.id,
        type,
        title,
        message,
        link,
        read: false,
        expires_at: expiresAt?.toISOString()
      };
      
      // Inserir otimisticamente na UI com ID temporário
      const tempId = `temp-${Date.now()}`;
      const tempNotification: Notification = {
        ...newNotification,
        id: tempId,
        created_at: new Date().toISOString()
      };
      
      setNotifications(prev => [tempNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('notifications')
        .insert(newNotification)
        .select('*')
        .single();
        
      if (error) {
        console.error("Erro ao adicionar notificação:", error);
        throw error;
      }
      
      // Atualizar notificação temporária com dados reais
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === tempId ? data : notification
        )
      );
    } catch (error) {
      console.error("Erro ao adicionar notificação:", error);
      toast.error("Não foi possível criar a notificação");
    }
  };

  // Função para atualizar as notificações
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .or(`expires_at.gt.${new Date().toISOString()},expires_at.is.null`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar notificações:", error);
        return;
      }
      
      setNotifications(data as Notification[]);
      const unread = data.filter(item => !item.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    notifications, 
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    addNotification,
    fetchNotifications
  };
};
