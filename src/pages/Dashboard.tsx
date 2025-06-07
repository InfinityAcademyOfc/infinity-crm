
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, DollarSign, Package, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: "Total de Clientes",
      value: "1,234",
      change: "+20.1%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Vendas do Mês",
      value: "R$ 45.231",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Produtos Ativos",
      value: "89",
      change: "+3.2%",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Taxa de Conversão",
      value: "3.21%",
      change: "+0.5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    { id: 1, action: "Novo cliente cadastrado", client: "João Silva", time: "2 horas atrás" },
    { id: 2, action: "Venda realizada", client: "Maria Santos", time: "4 horas atrás" },
    { id: 3, action: "Reunião agendada", client: "Pedro Costa", time: "6 horas atrás" },
    { id: 4, action: "Proposta enviada", client: "Ana Lima", time: "1 dia atrás" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> desde o mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
            <CardDescription>Performance de vendas recente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mb-2" />
              <span>Gráfico de vendas em desenvolvimento</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.client}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Users className="h-6 w-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Novo Cliente</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Package className="h-6 w-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Novo Produto</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <Calendar className="h-6 w-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Agendar Reunião</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent transition-colors">
              <DollarSign className="h-6 w-6 mb-2 mx-auto" />
              <p className="text-sm font-medium">Nova Venda</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
