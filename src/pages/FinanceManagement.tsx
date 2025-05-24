
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FinanceManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const mockTransactions = [
    {
      id: 1,
      type: 'Receita',
      description: 'Pagamento - João Silva',
      amount: 15000,
      date: '2024-01-15',
      status: 'Pago',
      category: 'Vendas'
    },
    {
      id: 2,
      type: 'Despesa',
      description: 'Licença Software',
      amount: -2500,
      date: '2024-01-14',
      status: 'Pago',
      category: 'Operacional'
    },
    {
      id: 3,
      type: 'Receita',
      description: 'Pagamento - Maria Santos',
      amount: 8500,
      date: '2024-01-13',
      status: 'Pendente',
      category: 'Vendas'
    }
  ];

  const mockBudget = [
    { category: 'Vendas', planned: 50000, actual: 23500, percentage: 47 },
    { category: 'Marketing', planned: 15000, actual: 12000, percentage: 80 },
    { category: 'Operacional', planned: 20000, actual: 18500, percentage: 92 },
    { category: 'Desenvolvimento', planned: 25000, actual: 20000, percentage: 80 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Atrasado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">Controle suas finanças e orçamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Período
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 23.500</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 18.500</div>
            <p className="text-xs text-muted-foreground">-5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">R$ 5.000</div>
            <p className="text-xs text-muted-foreground">+25% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ 8.500</div>
            <p className="text-xs text-muted-foreground">2 pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="budget">Orçamento</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Últimas movimentações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'Receita' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'Receita' ? (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Orçamento</CardTitle>
              <CardDescription>Acompanhe seus gastos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockBudget.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        R$ {item.actual.toLocaleString()} / R$ {item.planned.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getBudgetColor(item.percentage)}`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.percentage}% utilizado</span>
                      <span>R$ {(item.planned - item.actual).toLocaleString()} restante</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>Análises e insights financeiros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  Relatório de Receitas
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <TrendingDown className="w-8 h-8 mb-2" />
                  Relatório de Despesas
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <DollarSign className="w-8 h-8 mb-2" />
                  Fluxo de Caixa
                </Button>
                <Button variant="outline" className="h-24 flex flex-col">
                  <Filter className="w-8 h-8 mb-2" />
                  Relatório Customizado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;
