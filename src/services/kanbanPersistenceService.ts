
import { createClient } from '@supabase/supabase-js';
import { KanbanColumnItem } from '@/components/kanban/types';
import { supabase } from '@/lib/supabase';

interface KanbanState {
  id?: string;
  user_id: string;
  company_id: string;
  kanban_type: 'sales' | 'production' | 'clients';
  state: KanbanColumnItem[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Serviço para persistir estados de kanban no Supabase
 */
export const kanbanPersistenceService = {
  /**
   * Salva o estado do kanban no Supabase
   */
  saveKanbanState: async (
    userId: string,
    companyId: string,
    kanbanType: 'sales' | 'production' | 'clients',
    columns: KanbanColumnItem[]
  ): Promise<void> => {
    if (!userId || !companyId) {
      console.warn('Usuário ou empresa não fornecidos para salvar estado do kanban');
      return;
    }

    try {
      // Verificar se já existe um estado salvo
      const { data: existingState } = await supabase
        .from('kanban_states')
        .select('id')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .eq('kanban_type', kanbanType)
        .maybeSingle();

      if (existingState?.id) {
        // Atualizar estado existente
        await supabase
          .from('kanban_states')
          .update({
            state: columns,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingState.id);
      } else {
        // Criar novo estado
        await supabase
          .from('kanban_states')
          .insert({
            user_id: userId,
            company_id: companyId,
            kanban_type: kanbanType,
            state: columns,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      // Mantém uma cópia no localStorage para acesso offline
      localStorage.setItem(
        `kanban_state_${userId}_${companyId}_${kanbanType}`, 
        JSON.stringify(columns)
      );
    } catch (error) {
      console.error('Erro ao salvar estado do kanban:', error);
      // Fallback para localStorage em caso de erro de conexão
      localStorage.setItem(
        `kanban_state_${userId}_${companyId}_${kanbanType}`, 
        JSON.stringify(columns)
      );
    }
  },

  /**
   * Carrega o estado do kanban do Supabase
   */
  loadKanbanState: async (
    userId: string,
    companyId: string,
    kanbanType: 'sales' | 'production' | 'clients'
  ): Promise<KanbanColumnItem[] | null> => {
    if (!userId || !companyId) {
      console.warn('Usuário ou empresa não fornecidos para carregar estado do kanban');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('kanban_states')
        .select('state')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .eq('kanban_type', kanbanType)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Se encontrou dados no Supabase, retorna
      if (data?.state) {
        return data.state as KanbanColumnItem[];
      }
      
      // Fallback para localStorage (migração ou modo offline)
      const savedState = localStorage.getItem(`kanban_state_${userId}_${companyId}_${kanbanType}`);
      return savedState ? JSON.parse(savedState) : null;
    } catch (error) {
      console.error('Erro ao carregar estado do kanban:', error);
      // Fallback para localStorage em caso de erro
      const savedState = localStorage.getItem(`kanban_state_${userId}_${companyId}_${kanbanType}`);
      return savedState ? JSON.parse(savedState) : null;
    }
  },

  /**
   * Configura salvamento automático para o kanban
   */
  setupAutoSave: (
    userId: string,
    companyId: string,
    kanbanType: 'sales' | 'production' | 'clients',
    columns: KanbanColumnItem[],
    setColumns: React.Dispatch<React.SetStateAction<KanbanColumnItem[]>>
  ) => {
    // Salvar o estado inicial se ainda não existir
    kanbanPersistenceService.saveKanbanState(userId, companyId, kanbanType, columns);

    // Criar uma função wrapper para setColumns que também salva no Supabase
    const setColumnsWithPersistence = (
      value: React.SetStateAction<KanbanColumnItem[]>
    ) => {
      setColumns((prevColumns) => {
        const newColumns = typeof value === 'function' ? value(prevColumns) : value;
        
        // Salvar no Supabase após atualizar o estado
        kanbanPersistenceService.saveKanbanState(userId, companyId, kanbanType, newColumns);
        
        return newColumns;
      });
    };

    return setColumnsWithPersistence;
  }
};
