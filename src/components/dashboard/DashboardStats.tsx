
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { useRealData } from '@/hooks/useRealData';

export default function DashboardStats() {
  const { leads, clients, transactions, goals } = useRealData();

  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const activeGoals = goals.filter(g => g.status === 'active').length;

  const stats = [
    {
      title: 'Leads Ativos',
      value: leads.length,
      icon: TrendingUp,
      description: 'Total de leads no funil',
      trend: '+12% em relação ao mês anterior'
    },
    {
      title: 'Clientes',
      value: clients.filter(c => c.status === 'active').length,
      icon: Users,
      description: 'Clientes ativos',
      trend: '+5% em relação ao mês anterior'
    },
    {
      title: 'Receita',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      description: 'Receita total',
      trend: `Lucro: R$ ${(totalRevenue - totalExpenses).toLocaleString('pt-BR')}`
    },
    {
      title: 'Metas Ativas',
      value: activeGoals,
      icon: Target,
      description: 'Metas em andamento',
      trend: `${goals.length} metas no total`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
