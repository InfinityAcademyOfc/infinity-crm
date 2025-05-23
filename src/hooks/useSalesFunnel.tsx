
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { KanbanColumnItem, KanbanCardItem } from '@/components/kanban/types';
import { useToast } from '@/hooks/use-toast';
import { kanbanPersistenceService } from '@/services/kanbanPersistenceService';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/lib/supabase';

export const useSalesFunnel = (initialColumns: KanbanColumnItem[]) => {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(initialColumns);
  const [newCardOpen, setNewCardOpen] = useState(false);
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<KanbanCardItem | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string>('');
  const [funnelStageData, setFunnelStageData] = useState<any[]>([]);
  const [valuePotentialData, setValuePotentialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, company } = useAuth();
  const { toast } = useToast();
  const { notifySystemEvent } = useNotifications();

  // Carregar dados salvos do kanban quando o componente montar
  useEffect(() => {
    async function loadSavedState() {
      if (!user?.id || !company?.id) return;

      try {
        setLoading(true);
        const savedColumns = await kanbanPersistenceService.loadKanbanState(
          user.id,
          company.id,
          'sales'
        );

        if (savedColumns && savedColumns.length > 0) {
          setColumns(savedColumns);
          console.log('Estado do kanban carregado do Supabase');
        } else {
          // Se não há estado salvo, salva o estado inicial
          await kanbanPersistenceService.saveKanbanState(
            user.id,
            company.id,
            'sales',
            initialColumns
          );
          console.log('Estado inicial do kanban salvo no Supabase');
        }
      } catch (error) {
        console.error('Erro ao carregar estado do kanban:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSavedState();
  }, [user, company, initialColumns]);

  // Setup de salvamento automático ao mudar os columns
  useEffect(() => {
    if (!user?.id || !company?.id || loading) return;
    
    const saveChanges = async () => {
      await kanbanPersistenceService.saveKanbanState(
        user.id,
        company.id,
        'sales',
        columns
      );
    };
    
    saveChanges();
    
    // Preparar dados para gráficos do funil
    const prepareAnalyticsData = () => {
      // Dados para o funil por etapas
      const stageData = columns.map(column => ({
        name: column.title,
        value: column.cards.length
      }));
      
      // Dados para o valor potencial por etapa
      const valueData = columns.map(column => ({
        name: column.title,
        value: column.cards.reduce((acc, card) => 
          acc + (Number(card.value) || 0), 0
        )
      }));
      
      setFunnelStageData(stageData);
      setValuePotentialData(valueData);
    };
    
    prepareAnalyticsData();
  }, [columns, user, company, loading]);

  // Carregar leads do Supabase se não houver dados iniciais
  const loadLeadsFromDatabase = useCallback(async () => {
    if (!company?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', company.id);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Mapear leads para cards de kanban
        const leadsAsCards = data.map(lead => ({
          id: lead.id,
          title: lead.title,
          value: lead.value,
          description: lead.description,
          client: lead.name,
          assignee: lead.assigned_to,
          tags: lead.source ? [lead.source] : [],
          dueDate: lead.due_date,
          priority: lead.priority
        }));
        
        // Verificar se os cards já estão em alguma coluna, se não, adicionar à primeira
        const newColumns = [...columns];
        let updatedColumns = false;
        
        leadsAsCards.forEach(card => {
          // Verificar se o card já existe em alguma coluna
          const existsInColumn = newColumns.some(column => 
            column.cards.some(existingCard => existingCard.id === card.id)
          );
          
          if (!existsInColumn && newColumns.length > 0) {
            newColumns[0].cards.push(card);
            updatedColumns = true;
          }
        });
        
        if (updatedColumns) {
          setColumns(newColumns);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    }
  }, [company, columns]);
  
  // Carregar leads quando não houver cards no kanban
  useEffect(() => {
    const totalCards = columns.reduce((acc, col) => acc + col.cards.length, 0);
    
    if (totalCards === 0 && !loading && user?.id && company?.id) {
      loadLeadsFromDatabase();
    }
  }, [columns, loading, user, company, loadLeadsFromDatabase]);

  // Handlers
  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setNewCardOpen(true);
  };

  const handleSaveNewLead = async (card: KanbanCardItem) => {
    if (!user?.id || !company?.id) return;

    const newColumns = columns.map((col) =>
      col.id === activeColumnId
        ? { ...col, cards: [...col.cards, { ...card, id: `lead-${Date.now()}` }] }
        : col
    );
    
    setColumns(newColumns);
    setNewCardOpen(false);
    
    // Salvar novo lead no banco de dados
    try {
      // Extrair dados para a tabela de leads
      const leadData = {
        title: card.title,
        name: card.client,
        description: card.description,
        value: card.value ? Number(card.value) : null,
        assigned_to: card.assignee,
        priority: card.priority || 'medium',
        status: activeColumnId,
        company_id: company.id,
        due_date: card.dueDate,
        source: card.tags?.[0]
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select('*')
        .single();
        
      if (error) throw error;
      
      // Atualizar o ID do card para o ID do banco de dados
      const updatedColumns = columns.map((col) =>
        col.id === activeColumnId
          ? { 
              ...col, 
              cards: col.cards.map(c => 
                c.id === card.id ? { ...c, id: data.id } : c
              ) 
            }
          : col
      );
      
      setColumns(updatedColumns);
      
      // Notificar criação de lead
      await notifySystemEvent(
        "Novo lead criado", 
        `Um novo lead "${card.title}" foi criado.`,
        "/app/sales"
      );
      
      toast({
        title: "Lead criado",
        description: "O lead foi adicionado com sucesso ao funil de vendas."
      });
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      toast({
        title: "Erro ao criar lead",
        description: "Não foi possível salvar o lead no banco de dados.",
        variant: "destructive"
      });
    }
  };

  const handleEditCard = (cardId: string, columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return;

    const card = column.cards.find((c) => c.id === cardId);
    if (!card) return;

    setActiveCard(card);
    setActiveColumnId(columnId);
    setEditCardOpen(true);
  };

  const handleUpdateCard = async (updatedCard: KanbanCardItem) => {
    if (!activeCard || !user?.id || !company?.id) return;
    
    // Atualizar estado local
    const newColumns = columns.map((col) =>
      col.id === activeColumnId
        ? {
            ...col,
            cards: col.cards.map((card) =>
              card.id === activeCard.id ? { ...card, ...updatedCard } : card
            ),
          }
        : col
    );
    
    setColumns(newColumns);
    setEditCardOpen(false);
    
    // Atualizar no banco de dados
    try {
      // Extrair dados para a tabela de leads
      const leadData = {
        title: updatedCard.title,
        name: updatedCard.client,
        description: updatedCard.description,
        value: updatedCard.value ? Number(updatedCard.value) : null,
        assigned_to: updatedCard.assignee,
        priority: updatedCard.priority || 'medium',
        status: activeColumnId,
        due_date: updatedCard.dueDate,
        source: updatedCard.tags?.[0],
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', activeCard.id);
        
      if (error) throw error;
      
      toast({
        title: "Lead atualizado",
        description: "As alterações foram salvas com sucesso."
      });
      
      // Notificar atualização de lead
      await notifySystemEvent(
        "Lead atualizado", 
        `O lead "${updatedCard.title}" foi atualizado.`,
        "/app/sales"
      );
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast({
        title: "Erro ao atualizar lead",
        description: "Não foi possível salvar as alterações no banco de dados.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCard = async (cardId: string, columnId: string) => {
    if (!user?.id || !company?.id) return;
    
    // Encontrar card para mostrar informações no toast
    const column = columns.find(col => col.id === columnId);
    const card = column?.cards.find(c => c.id === cardId);
    
    // Atualizar estado local
    const newColumns = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          }
        : col
    );
    
    setColumns(newColumns);
    
    // Excluir do banco de dados
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', cardId);
        
      if (error) throw error;
      
      toast({
        title: "Lead removido",
        description: "O lead foi excluído do funil de vendas."
      });
      
      // Notificar exclusão de lead
      if (card) {
        await notifySystemEvent(
          "Lead removido", 
          `O lead "${card.title}" foi removido do funil de vendas.`,
          "/app/sales"
        );
      }
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast({
        title: "Erro ao remover lead",
        description: "Não foi possível excluir o lead do banco de dados.",
        variant: "destructive"
      });
    }
  };

  const handleAddNewLead = () => {
    if (columns.length > 0) {
      setActiveColumnId(columns[0].id);
      setNewCardOpen(true);
    }
  };

  // Método para converter lead para cliente
  const convertLeadToClient = async (cardId: string, columnId: string) => {
    if (!user?.id || !company?.id) return;
    
    try {
      // Encontrar o card
      const column = columns.find(col => col.id === columnId);
      const card = column?.cards.find(c => c.id === cardId);
      
      if (!card) {
        throw new Error('Lead não encontrado');
      }
      
      // Obter dados do lead do Supabase
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', cardId)
        .single();
        
      if (leadError) throw leadError;
      
      // Criar novo cliente
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          segment: lead.source,
          status: 'active',
          company_id: company.id,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();
        
      if (clientError) throw clientError;
      
      // Remover lead após conversão
      const { error: deleteError } = await supabase
        .from('leads')
        .delete()
        .eq('id', cardId);
        
      if (deleteError) throw deleteError;
      
      // Atualizar estado local (remover da lista)
      const newColumns = columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.filter((c) => c.id !== cardId),
            }
          : col
      );
      
      setColumns(newColumns);
      
      toast({
        title: "Lead convertido em cliente",
        description: `${card.client} foi convertido em cliente com sucesso.`
      });
      
      // Notificar conversão
      await notifySystemEvent(
        "Lead convertido em cliente", 
        `O lead "${card.title}" foi convertido em cliente com sucesso.`,
        "/app/clients"
      );
      
      return client;
    } catch (error) {
      console.error('Erro ao converter lead:', error);
      toast({
        title: "Erro na conversão",
        description: "Não foi possível converter o lead em cliente.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    columns,
    setColumns,
    newCardOpen,
    setNewCardOpen,
    editCardOpen,
    setEditCardOpen,
    activeCard,
    activeColumnId,
    funnelStageData,
    valuePotentialData,
    loading,
    handleAddCard,
    handleAddNewLead,
    handleSaveNewLead,
    handleEditCard,
    handleUpdateCard,
    handleDeleteCard,
    convertLeadToClient
  };
};
