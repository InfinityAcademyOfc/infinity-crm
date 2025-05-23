
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface RealDataState {
  leads: any[];
  clients: any[];
  tasks: any[];
  products: any[];
  meetings: any[];
  teamMembers: any[];
  transactions: any[];
  documents: any[];
  loading: boolean;
  error: string | null;
}

export const useRealData = () => {
  const { user, company } = useAuth();
  const [state, setState] = useState<RealDataState>({
    leads: [],
    clients: [],
    tasks: [],
    products: [],
    meetings: [],
    teamMembers: [],
    transactions: [],
    documents: [],
    loading: true,
    error: null
  });

  const fetchAllData = async () => {
    if (!user || !company?.id) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Buscar todos os dados em paralelo
      const [
        leadsResponse,
        clientsResponse,
        tasksResponse,
        productsResponse,
        meetingsResponse,
        teamResponse,
        transactionsResponse,
        documentsResponse
      ] = await Promise.all([
        supabase.from('leads').select('*').eq('company_id', company.id),
        supabase.from('clients').select('*').eq('company_id', company.id),
        supabase.from('tasks').select('*').eq('company_id', company.id),
        supabase.from('products').select('*').eq('company_id', company.id),
        supabase.from('meetings').select('*').eq('company_id', company.id),
        supabase.from('profiles').select('*').eq('company_id', company.id),
        supabase.from('financial_transactions').select('*').eq('company_id', company.id),
        supabase.from('documents').select('*').eq('company_id', company.id)
      ]);

      // Verificar erros
      const responses = [
        leadsResponse, 
        clientsResponse, 
        tasksResponse, 
        productsResponse, 
        meetingsResponse, 
        teamResponse,
        transactionsResponse,
        documentsResponse
      ];
      const hasError = responses.some(response => response.error);

      if (hasError) {
        const errors = responses.filter(r => r.error).map(r => r.error?.message).join(', ');
        throw new Error(errors);
      }

      setState({
        leads: leadsResponse.data || [],
        clients: clientsResponse.data || [],
        tasks: tasksResponse.data || [],
        products: productsResponse.data || [],
        meetings: meetingsResponse.data || [],
        teamMembers: teamResponse.data || [],
        transactions: transactionsResponse.data || [],
        documents: documentsResponse.data || [],
        loading: false,
        error: null
      });

    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao carregar dados'
      }));
      toast.error('Erro ao carregar dados do sistema');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user, company]);

  // Configurar tempo real para todos os módulos
  useEffect(() => {
    if (!company?.id) return;

    const channels = [
      supabase.channel('leads-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leads', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('clients-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('tasks-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('products-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('meetings-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'meetings', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('profiles-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('transactions-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'financial_transactions', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      ),
      supabase.channel('documents-real-time').on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents', filter: `company_id=eq.${company.id}` }, 
        () => fetchAllData()
      )
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [company]);

  return {
    ...state,
    refetch: fetchAllData
  };
};
