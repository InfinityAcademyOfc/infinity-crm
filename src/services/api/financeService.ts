
import { supabase } from "@/integrations/supabase/client";

export interface FinancialTransaction {
  id: string;
  company_id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: string;
  category?: string;
  status: string;
  reference_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialCategory {
  id: string;
  company_id: string;
  type: 'income' | 'expense';
  name: string;
  created_at: string;
  updated_at: string;
}

export const financeService = {
  async getTransactions(companyId: string): Promise<FinancialTransaction[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('company_id', companyId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      type: item.type as 'income' | 'expense'
    }));
  },

  async createTransaction(transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialTransaction | null> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar transação:', error);
      return null;
    }
    
    return {
      ...data,
      type: data.type as 'income' | 'expense'
    };
  },

  async updateTransaction(id: string, updates: Partial<FinancialTransaction>): Promise<FinancialTransaction | null> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar transação:', error);
      return null;
    }
    
    return {
      ...data,
      type: data.type as 'income' | 'expense'
    };
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar transação:', error);
      return false;
    }
    
    return true;
  },

  async getCategories(companyId: string): Promise<FinancialCategory[]> {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .eq('company_id', companyId)
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      type: item.type as 'income' | 'expense'
    }));
  },

  async createCategory(category: Omit<FinancialCategory, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialCategory | null> {
    const { data, error } = await supabase
      .from('financial_categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar categoria:', error);
      return null;
    }
    
    return {
      ...data,
      type: data.type as 'income' | 'expense'
    };
  },

  async getFinancialSummary(companyId: string, period?: { start: string; end: string }) {
    let query = supabase
      .from('financial_transactions')
      .select('type, amount, date')
      .eq('company_id', companyId);

    if (period) {
      query = query
        .gte('date', period.start)
        .lte('date', period.end);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Erro ao buscar resumo financeiro:', error);
      return { totalIncome: 0, totalExpense: 0, netProfit: 0 };
    }

    const totalIncome = data
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    const totalExpense = data
      ?.filter(t => t.type === 'expense')  
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense
    };
  }
};
