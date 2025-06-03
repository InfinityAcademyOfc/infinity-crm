
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const FinancialReport = () => {
  const monthlyFinancial = [
    { month: 'Jan', receita: 85000, despesas: 52000, lucro: 33000 },
    { month: 'Fev', receita: 92000, despesas: 48000, lucro: 44000 },
    { month: 'Mar', receita: 78000, despesas: 55000, lucro: 23000 },
    { month: 'Abr', receita: 105000, despesas: 62000, lucro: 43000 },
    { month: 'Mai', receita: 118000, despesas: 58000, lucro: 60000 },
    { month: 'Jun', receita: 127000, despesas: 65000, lucro: 62000 }
  ];

  const categoryExpenses = [
    { category: 'Marketing', valor: 15000, percentage: 23 },
    { category: 'Pessoal', valor: 35000, percentage: 54 },
    { category: 'Infraestrutura', valor: 8000, percentage: 12 },
    { category: 'Outros', valor: 7000, percentage: 11 }
  ];

  const kpis = [
    {
      title: 'Margem de Lucro',
      value: '48.8%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'ROI Marketing',
      value: '320%',
      change: '+12%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Custo por Cliente',
      value: 'R$ 245',
      change: '-8%',
      trend: 'down',
      icon: TrendingDown
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs mt-1">
                  <Badge 
                    variant={kpi.trend === 'up' ? 'default' : 'destructive'} 
                    className="text-xs"
                  >
                    {kpi.change}
                  </Badge>
                  <span className="ml-2 text-muted-foreground">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyFinancial}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} name="Receita" />
                <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} name="Despesas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lucro Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFinancial}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Lucro']} />
                <Bar dataKey="lucro" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryExpenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{expense.category}</span>
                    <span className="text-sm text-muted-foreground">
                      R$ {expense.valor.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                </div>
                <Badge variant="outline" className="ml-4">
                  {expense.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Trimestre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Receita Total:</span>
              <span className="font-semibold">R$ 605.000</span>
            </div>
            <div className="flex justify-between">
              <span>Despesas Totais:</span>
              <span className="font-semibold">R$ 340.000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Lucro Líquido:</span>
              <span className="font-bold text-green-600">R$ 265.000</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projeções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Receita Projetada (Jul):</span>
              <span className="font-semibold">R$ 135.000</span>
            </div>
            <div className="flex justify-between">
              <span>Meta Trimestral:</span>
              <span className="font-semibold">R$ 400.000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Progresso:</span>
              <Badge variant="default">66.3%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReport;
