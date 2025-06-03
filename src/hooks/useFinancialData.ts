
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  date: string;
  status: string;
  reference_id?: string;
  company_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useFinancialData = () => {
  const { company } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', company.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          ...transactionData,
          company_id: company.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTransactions(prev => [data, ...prev]);
      toast.success('Transação criada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      toast.error('Erro ao criar transação');
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTransactions(prev => prev.map(transaction => transaction.id === id ? data : transaction));
      toast.success('Transação atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [company]);

  return {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
