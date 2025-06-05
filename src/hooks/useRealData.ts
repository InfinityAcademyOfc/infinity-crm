
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'high' | 'medium' | 'low';
  source: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'prospect';
  company_id: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  company_id: string;
  created_at: string;
}

export const useRealData = () => {
  const { company, user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!company?.id && !user?.id) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const companyId = company?.id || user?.id;

        // Fetch leads
        const { data: leadsData } = await supabase
          .from('leads')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        // Fetch clients
        const { data: clientsData } = await supabase
          .from('clients')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        // Fetch transactions
        const { data: transactionsData } = await supabase
          .from('financial_transactions')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (mounted) {
          setLeads(leadsData || []);
          setClients(clientsData || []);
          setTransactions(transactionsData || []);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (mounted) {
          setError('Erro ao carregar dados');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [company?.id, user?.id]);

  return {
    leads,
    clients,
    transactions,
    loading,
    error,
    // Mock data for missing entities
    tasks: [],
    products: [],
    meetings: [],
    teamMembers: [],
    activities: [],
    goals: []
  };
};
