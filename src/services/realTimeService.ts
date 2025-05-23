
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface RealTimeEvent {
  table: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  old?: any;
  new?: any;
}

class RealTimeService {
  private channels: Map<string, any> = new Map();
  private subscribers: Map<string, Set<(event: RealTimeEvent) => void>> = new Map();

  subscribe(table: string, callback: (event: RealTimeEvent) => void) {
    // Adicionar callback à lista de subscribers
    if (!this.subscribers.has(table)) {
      this.subscribers.set(table, new Set());
    }
    this.subscribers.get(table)!.add(callback);

    // Criar canal se não existir
    if (!this.channels.has(table)) {
      this.createChannel(table);
    }

    return () => {
      // Função de cleanup
      const tableSubscribers = this.subscribers.get(table);
      if (tableSubscribers) {
        tableSubscribers.delete(callback);
        if (tableSubscribers.size === 0) {
          this.removeChannel(table);
        }
      }
    };
  }

  private createChannel(table: string) {
    const channel = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          const event: RealTimeEvent = {
            table,
            type: payload.eventType as any,
            old: payload.old,
            new: payload.new
          };

          // Notificar todos os subscribers
          const subscribers = this.subscribers.get(table);
          if (subscribers) {
            subscribers.forEach(callback => callback(event));
          }

          // Mostrar notificação para mudanças importantes
          this.showNotificationForEvent(event);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Real-time subscription ativa para: ${table}`);
        }
      });

    this.channels.set(table, channel);
  }

  private removeChannel(table: string) {
    const channel = this.channels.get(table);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(table);
      this.subscribers.delete(table);
    }
  }

  private showNotificationForEvent(event: RealTimeEvent) {
    const { table, type, new: newData } = event;

    let message = '';
    switch (table) {
      case 'leads':
        if (type === 'INSERT') {
          message = `Novo lead criado: ${newData?.name || 'Lead'}`;
        } else if (type === 'UPDATE') {
          message = `Lead atualizado: ${newData?.name || 'Lead'}`;
        }
        break;
      case 'clients':
        if (type === 'INSERT') {
          message = `Novo cliente cadastrado: ${newData?.name || 'Cliente'}`;
        }
        break;
      case 'tasks':
        if (type === 'INSERT') {
          message = `Nova tarefa criada: ${newData?.title || 'Tarefa'}`;
        } else if (type === 'UPDATE' && newData?.status === 'completed') {
          message = `Tarefa concluída: ${newData?.title || 'Tarefa'}`;
        }
        break;
    }

    if (message) {
      toast.info(message);
    }
  }

  cleanup() {
    // Limpar todos os canais
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.subscribers.clear();
  }
}

export const realTimeService = new RealTimeService();
