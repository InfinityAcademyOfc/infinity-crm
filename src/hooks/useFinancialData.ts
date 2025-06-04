
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string | null;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  reference_id: string | null;
  company_id: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
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
      
      // Validar e converter dados
      const validatedData = (data || []).map(transaction => ({
        ...transaction,
        type: (['income', 'expense'].includes(transaction.type) 
          ? transaction.type 
          : 'income') as 'income' | 'expense',
        status: (['completed', 'pending', 'cancelled'].includes(transaction.status) 
          ? transaction.status 
          : 'completed') as 'completed' | 'pending' | 'cancelled'
      })) as FinancialTransaction[];

      setTransactions(validatedData);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
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
      
      const validatedData = {
        ...data,
        type: (['income', 'expense'].includes(data.type) 
          ? data.type 
          : 'income') as 'income' | 'expense',
        status: (['completed', 'pending', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'completed') as 'completed' | 'pending' | 'cancelled'
      } as FinancialTransaction;

      setTransactions(prev => [validatedData, ...prev]);
      toast.success('Transação criada com sucesso!');
      return validatedData;
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
      
      const validatedData = {
        ...data,
        type: (['income', 'expense'].includes(data.type) 
          ? data.type 
          : 'income') as 'income' | 'expense',
        status: (['completed', 'pending', 'cancelled'].includes(data.status) 
          ? data.status 
          : 'completed') as 'completed' | 'pending' | 'cancelled'
      } as FinancialTransaction;

      setTransactions(prev => prev.map(t => t.id === id ? validatedData : t));
      toast.success('Transação atualizada com sucesso!');
      return validatedData;
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
