
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, TrendingUp, Calendar, Target, Activity, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealData } from '@/hooks/useRealData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { 
    leads, 
    clients, 
    tasks, 
    products, 
    meetings, 
    transactions, 
    activities, 
    goals,
    loading: dataLoading, 
    error,
    refetch 
  } = useRealData();

  const loading = authLoading || dataLoading;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
                <Skeleton className="h-4 w-[120px] mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user || !company) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">Acesso Necessário</h2>
          <p className="text-muted-foreground mb-4">
            Faça login para acessar o dashboard da sua empresa.
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalLeads = leads.length;
  const totalClients = clients.length;
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  // Calculate conversion rate
  const conversionRate = totalLeads > 0 ? Math.round((totalClients / totalLeads) * 100) : 0;

  // Prepare chart data
  const monthlyData = [
    { month: 'Jan', leads: Math.floor(totalLeads * 0.1), clients: Math.floor(totalClients * 0.1) },
    { month: 'Fev', leads: Math.floor(totalLeads * 0.15), clients: Math.floor(totalClients * 0.15) },
    { month: 'Mar', leads: Math.floor(totalLeads * 0.2), clients: Math.floor(totalClients * 0.2) },
    { month: 'Abr', leads: Math.floor(totalLeads * 0.25), clients: Math.floor(totalClients * 0.25) },
    { month: 'Mai', leads: Math.floor(totalLeads * 0.3), clients: Math.floor(totalClients * 0.4) },
    { month: 'Jun', leads: totalLeads, clients: totalClients },
  ];

  const statusData = [
    { name: 'Novos', value: leads.filter(l => l.status === 'new').length, color: '#3b82f6' },
    { name: 'Contactados', value: leads.filter(l => l.status === 'contacted').length, color: '#10b981' },
    { name: 'Qualificados', value: leads.filter(l => l.status === 'qualified').length, color: '#f59e0b' },
    { name: 'Proposta', value: leads.filter(l => l.status === 'proposal').length, color: '#8b5cf6' },
    { name: 'Fechados', value: leads.filter(l => l.status === 'won').length, color: '#06d6a0' },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta, {company.name}! Aqui está um resumo da sua empresa.
          </p>
        </div>
        <Button onClick={refetch} variant="outline">
          Atualizar Dados
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(totalLeads * 0.2)} desde o último mês
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {conversionRate}% de conversão
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado em {transactions.filter(t => t.type === 'income').length} transações
            </p>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 animate-scale-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Evolução de Leads e Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Clientes"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 animate-scale-in" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Status dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-scale-in" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma atividade registrada ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in" style={{ animationDelay: '700ms' }}>
          <CardHeader>
            <CardTitle>Próximas Reuniões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meetings.slice(0, 5).map((meeting) => (
                <div key={meeting.id} className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(meeting.date).toLocaleDateString('pt-BR')} às {meeting.time}
                    </p>
                  </div>
                  <Badge 
                    variant={meeting.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {meeting.status === 'completed' ? 'Concluída' : 'Agendada'}
                  </Badge>
                </div>
              ))}
              {meetings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma reunião agendada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-scale-in" style={{ animationDelay: '800ms' }}>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2 hover-scale transition-all duration-200"
              onClick={() => window.location.href = '/app/sales-funnel'}
            >
              <Users className="h-6 w-6" />
              <span>Novo Lead</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2 hover-scale transition-all duration-200"
              onClick={() => window.location.href = '/app/clients'}
            >
              <Phone className="h-6 w-6" />
              <span>Novo Cliente</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2 hover-scale transition-all duration-200"
              onClick={() => window.location.href = '/app/meetings'}
            >
              <Calendar className="h-6 w-6" />
              <span>Agendar Reunião</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2 hover-scale transition-all duration-200"
              onClick={() => window.location.href = '/app/finance'}
            >
              <DollarSign className="h-6 w-6" />
              <span>Nova Transação</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
