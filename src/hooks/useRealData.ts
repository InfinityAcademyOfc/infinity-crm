
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
        teamResponse
      ] = await Promise.all([
        supabase.from('leads').select('*').eq('company_id', company.id),
        supabase.from('clients').select('*').eq('company_id', company.id),
        supabase.from('tasks').select('*').eq('company_id', company.id),
        supabase.from('products').select('*').eq('company_id', company.id),
        supabase.from('meetings').select('*').eq('company_id', company.id),
        supabase.from('profiles').select('*').eq('company_id', company.id)
      ]);

      // Verificar erros
      const responses = [leadsResponse, clientsResponse, tasksResponse, productsResponse, meetingsResponse, teamResponse];
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

  return {
    ...state,
    refetch: fetchAllData
  };
};
