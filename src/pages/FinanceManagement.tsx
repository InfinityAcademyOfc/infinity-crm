import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/hooks/useFinancialData';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FinanceReports from '@/components/finance/FinanceReports';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const FinanceManagement = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { transactions, loading, metrics, createTransaction } = useFinancialData();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  if (authLoading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!user || !company) {
    return <LoadingPage message="Acesso não autorizado" />;
  }

  const handleCreateSampleTransaction = async (type: 'income' | 'expense') => {
    try {
      await createTransaction({
        type,
        amount: type === 'income' ? 1500 : 500,
        description: type === 'income' ? 'Venda de serviços' : 'Despesa operacional',
        category: type === 'income' ? 'Vendas' : 'Operacional',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        reference_id: null,
        created_by: user.id
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    return type === 'income' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader 
        title="Gestão Financeira" 
        description="Controle receitas, despesas e acompanhe a saúde financeira"
        actions={
          <>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10 focus-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="hover-scale transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={() => handleCreateSampleTransaction('income')}
              className="hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </>
        }
      />

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
        <Card className="hover-lift transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {metrics.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {metrics.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {metrics.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="animate-fade-in">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <Card className="animate-scale-in">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery ? 'Nenhuma transação encontrada' : 'Nenhuma transação registrada'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Tente ajustar os filtros de busca' 
                    : 'Comece registrando suas primeiras transações financeiras'
                  }
                </p>
                {!searchQuery && (
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => handleCreateSampleTransaction('income')}
                      className="hover-scale transition-all duration-200"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Adicionar Receita
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCreateSampleTransaction('expense')}
                      className="hover-scale transition-all duration-200"
                    >
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Adicionar Despesa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
                <Card 
                  key={transaction.id} 
                  className="hover-lift transition-all duration-200 animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <h4 className="font-medium">{transaction.description}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {transaction.category && (
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'income' ? '+' : '-'}R$ {Number(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="animate-fade-in">
          <FinanceReports transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;
