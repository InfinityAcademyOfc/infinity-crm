
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Target,
  CheckCircle2
} from 'lucide-react';
import { useRealClientData } from '@/hooks/useRealClientData';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useGoals } from '@/hooks/useGoals';
import { useMeetings } from '@/hooks/useMeetings';

export default function DashboardStats() {
  const { clients } = useRealClientData();
  const { transactions } = useFinancialData();
  const { goals } = useGoals();
  const { meetings } = useMeetings();

  // Calcular estatísticas
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const profit = totalRevenue - totalExpenses;
  
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalGoals = goals.length;
  
  const upcomingMeetings = meetings.filter(m => {
    const meetingDate = new Date(m.date);
    const today = new Date();
    return meetingDate >= today && m.status === 'scheduled';
  }).length;

  const stats = [
    {
      title: 'Total de Clientes',
      value: totalClients,
      subtitle: `${activeClients} ativos`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      subtitle: `Lucro: R$ ${profit.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Metas Concluídas',
      value: `${completedGoals}/${totalGoals}`,
      subtitle: totalGoals > 0 ? `${Math.round((completedGoals / totalGoals) * 100)}% completo` : 'Nenhuma meta',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Próximas Reuniões',
      value: upcomingMeetings,
      subtitle: 'Esta semana',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
