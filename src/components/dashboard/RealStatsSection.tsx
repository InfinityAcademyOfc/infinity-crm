
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Calendar, DollarSign, Building2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRealClientData } from '@/hooks/useRealClientData';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useMeetings } from '@/hooks/useMeetings';
import { useGoals } from '@/hooks/useGoals';
import { useRealProducts } from '@/hooks/useRealProducts';

const RealStatsSection = () => {
  const { clients, loading: clientsLoading } = useRealClientData();
  const { teamMembers, loading: teamLoading } = useTeamMembers();
  const { metrics, loading: financeLoading } = useFinancialData();
  const { meetings, loading: meetingsLoading } = useMeetings();
  const { goals, loading: goalsLoading } = useGoals();
  const { products, loading: productsLoading } = useRealProducts();

  const loading = clientsLoading || teamLoading || financeLoading || meetingsLoading || goalsLoading || productsLoading;

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const todayMeetings = meetings.filter(meeting => {
    const today = new Date().toISOString().split('T')[0];
    return meeting.date === today && meeting.status === 'scheduled';
  }).length;

  const activeGoals = goals.filter(goal => goal.status === 'active').length;

  const stats = [
    {
      title: "Total de Clientes",
      value: clients.length.toString(),
      description: "Clientes ativos",
      icon: Users,
      trend: "+12% este mês"
    },
    {
      title: "Receita Total",
      value: `R$ ${metrics.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: "Receita acumulada",
      icon: DollarSign,
      trend: `${metrics.balance >= 0 ? '+' : ''}${((metrics.balance / metrics.totalIncome) * 100).toFixed(1)}%`
    },
    {
      title: "Equipe",
      value: teamMembers.length.toString(),
      description: "Membros ativos",
      icon: Building2,
      trend: "Equipe atual"
    },
    {
      title: "Reuniões Hoje",
      value: todayMeetings.toString(),
      description: "Agendadas para hoje",
      icon: Calendar,
      trend: "Hoje"
    },
    {
      title: "Metas Ativas",
      value: activeGoals.toString(),
      description: "Objetivos em andamento",
      icon: Target,
      trend: "Em progresso"
    },
    {
      title: "Produtos/Serviços",
      value: products.length.toString(),
      description: "Itens cadastrados",
      icon: TrendingUp,
      trend: "Catálogo"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className="hover-lift transition-all duration-200 animate-scale-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <div className="text-xs text-green-600 mt-1">
              {stat.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RealStatsSection;
