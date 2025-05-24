
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string | null;
  date: string;
  status: string;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export const useFinancialData = () => {
  const { company } = useAuth();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
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
      toast.error('Erro ao carregar transações financeiras');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          ...transaction,
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

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTransactions(prev => prev.map(t => t.id === id ? data : t));
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
      
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
      throw error;
    }
  };

  // Calculate financial metrics
  const calculateMetrics = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length
    };
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
    refetch: fetchTransactions,
    metrics: calculateMetrics()
  };
};
