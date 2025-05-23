
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
          
        console.log(`Estado do kanban ${kanbanType} atualizado com sucesso`);
      } else {
        // Criar novo estado
        const { error } = await supabase
          .from('kanban_states')
          .insert({
            user_id: userId,
            company_id: companyId,
            kanban_type: kanbanType,
            state: columns,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Erro ao criar estado do kanban:', error);
        } else {
          console.log(`Estado do kanban ${kanbanType} criado com sucesso`);
        }
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
        console.error('Erro ao carregar kanban do Supabase:', error);
        throw error;
      }

      // Se encontrou dados no Supabase, retorna
      if (data?.state) {
        console.log(`Estado do kanban ${kanbanType} carregado do Supabase`);
        return data.state as KanbanColumnItem[];
      }
      
      // Fallback para localStorage (migração ou modo offline)
      console.log(`Tentando carregar estado do kanban ${kanbanType} do localStorage`);
      const savedState = localStorage.getItem(`kanban_state_${userId}_${companyId}_${kanbanType}`);
      if (savedState) {
        console.log(`Estado do kanban ${kanbanType} carregado do localStorage`);
        try {
          // Migrar do localStorage para Supabase
          const parsedState = JSON.parse(savedState) as KanbanColumnItem[];
          await kanbanPersistenceService.saveKanbanState(userId, companyId, kanbanType, parsedState);
          return parsedState;
        } catch (parseError) {
          console.error('Erro ao processar estado do localStorage:', parseError);
          return null;
        }
      }
      
      return null;
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
  },
  
  /**
   * Compartilhar estado do kanban entre módulos
   * Permite que um card seja movido de um kanban para outro
   */
  moveCardBetweenKanbans: async (
    userId: string,
    companyId: string, 
    sourceType: 'sales' | 'production' | 'clients',
    targetType: 'sales' | 'production' | 'clients',
    cardId: string,
    columnId: string
  ): Promise<boolean> => {
    try {
      // Carregar estados atuais
      const sourceState = await kanbanPersistenceService.loadKanbanState(
        userId, companyId, sourceType
      );
      
      const targetState = await kanbanPersistenceService.loadKanbanState(
        userId, companyId, targetType
      );
      
      if (!sourceState || !targetState) {
        console.error('Estados não encontrados para transferência');
        return false;
      }
      
      // Encontrar card na origem
      const sourceColumn = sourceState.find(col => col.id === columnId);
      if (!sourceColumn) {
        console.error('Coluna de origem não encontrada');
        return false;
      }
      
      const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) {
        console.error('Card não encontrado na origem');
        return false;
      }
      
      // Remover card da origem
      const card = {...sourceColumn.cards[cardIndex]};
      const updatedSourceState = sourceState.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: col.cards.filter(c => c.id !== cardId)
          };
        }
        return col;
      });
      
      // Determinar coluna de destino (primeira coluna)
      const targetColumn = targetState[0];
      if (!targetColumn) {
        console.error('Não foi possível determinar a coluna de destino');
        return false;
      }
      
      // Adicionar card ao destino
      const updatedTargetState = targetState.map((col, index) => {
        if (index === 0) {
          return {
            ...col,
            cards: [card, ...col.cards]
          };
        }
        return col;
      });
      
      // Salvar ambos os estados
      await Promise.all([
        kanbanPersistenceService.saveKanbanState(userId, companyId, sourceType, updatedSourceState),
        kanbanPersistenceService.saveKanbanState(userId, companyId, targetType, updatedTargetState)
      ]);
      
      return true;
    } catch (error) {
      console.error('Erro ao mover card entre kanbans:', error);
      return false;
    }
  }
};
