
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign, CalendarDays, Edit, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FinanceManagement = () => {
  const { user, companyProfile } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const companyId = companyProfile?.company_id || user?.id || "";

  const { data: transactions = [] } = useQuery({
    queryKey: ['financial-transactions', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
    staleTime: 30000,
  });

  // Calculate summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const balance = totalIncome - totalExpense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const transactionData = {
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: formData.get("date") as string,
      status: 'completed',
      company_id: companyId,
      created_by: user?.id
    };

    try {
      if (editingTransaction) {
        const { error } = await supabase
          .from('financial_transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id);
        
        if (error) throw error;
        toast.success("Transação atualizada com sucesso!");
      } else {
        const { error } = await supabase
          .from('financial_transactions')
          .insert(transactionData);
        
        if (error) throw error;
        toast.success("Transação criada com sucesso!");
      }
      
      queryClient.invalidateQueries({ queryKey: ['financial-transactions', companyId] });
      setDialogOpen(false);
      setEditingTransaction(null);
      form.reset();
    } catch (error) {
      toast.error("Erro ao salvar transação");
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setTransactionType(transaction.type);
    setDialogOpen(true);
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', transactionId);
      
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['financial-transactions', companyId] });
      toast.success("Transação removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover transação");
    }
  };

  const openNewTransactionDialog = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">
            Controle suas receitas e despesas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => openNewTransactionDialog('expense')}
          >
            <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
            Nova Despesa
          </Button>
          <Button onClick={() => openNewTransactionDialog('income')}>
            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
            Nova Receita
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <CalendarDays className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transações</CardTitle>
          <CardDescription>
            Histórico completo de receitas e despesas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                    {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma transação encontrada. Comece adicionando uma receita ou despesa.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingTransaction(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : `Nova ${transactionType === 'income' ? 'Receita' : 'Despesa'}`}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da transação financeira.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="type"
              type="hidden"
              value={transactionType}
            />
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição*</Label>
              <Input
                id="description"
                name="description"
                defaultValue={editingTransaction?.description || ""}
                placeholder={`Ex: ${transactionType === 'income' ? 'Pagamento de cliente' : 'Aluguel do escritório'}`}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Valor (R$)*</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingTransaction?.amount || ""}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Data*</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editingTransaction?.date || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria*</Label>
              <Select name="category" defaultValue={editingTransaction?.category || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {transactionType === 'income' ? (
                    <>
                      <SelectItem value="vendas">Vendas</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                      <SelectItem value="recorrente">Recorrente</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="pessoal">Pessoal</SelectItem>
                      <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingTransaction ? 'Atualizar' : 'Criar'} Transação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceManagement;
