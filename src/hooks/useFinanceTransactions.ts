
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types/finance";

export const useFinanceTransactions = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company?.id) {
      fetchTransactions();
    }
  }, [company?.id]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', company?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Transform data to match Transaction interface
      const transformedData: Transaction[] = (data || []).map(item => ({
        ...item,
        client: null, // Set default value since it's not in the database
        notes: null   // Set default value since it's not in the database
      }));
      
      setTransactions(transformedData);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar transações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          ...transactionData,
          company_id: company?.id,
          created_by: company?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the returned data to match Transaction interface
      const transformedData: Transaction = {
        ...data,
        client: null,
        notes: null
      };
      
      setTransactions(prev => [transformedData, ...prev]);
      toast({
        title: `${transactionData.type === "income" ? "Receita" : "Despesa"} adicionada`,
        description: `${transactionData.description} foi adicionada com sucesso`
      });
      
      return transformedData;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação",
        variant: "destructive"
      });
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
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover transação",
        variant: "destructive"
      });
    }
  };

  const getFinancialSummary = () => {
    const incomes = transactions.filter(t => t.type === "income");
    const expenses = transactions.filter(t => t.type === "expense");
    const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance, incomes, expenses };
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    getFinancialSummary,
    refetch: fetchTransactions
  };
};
