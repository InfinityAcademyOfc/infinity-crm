
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { 
  Users, 
  Target, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Filter,
  BarChart3
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';

const MetricsWidgets = () => {
  const { metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const widgets = [
    {
      title: 'Total de Leads',
      value: metrics.totalLeads,
      icon: Target,
      color: 'text-blue-600',
      change: `+${metrics.monthlyGrowth}%`,
      changeColor: metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Clientes Ativos',
      value: metrics.totalClients,
      icon: Users,
      color: 'text-purple-600',
      change: `Taxa Conv: ${metrics.conversionRate}%`,
      changeColor: 'text-gray-600'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      change: 'Este período',
      changeColor: 'text-gray-600'
    },
    {
      title: 'Tarefas Concluídas',
      value: metrics.completedTasks,
      icon: CheckCircle,
      color: 'text-emerald-600',
      change: `${metrics.pendingTasks} pendentes`,
      changeColor: 'text-orange-600'
    },
    {
      title: 'Etapas do Funil',
      value: metrics.activeFunnelStages,
      icon: Filter,
      color: 'text-indigo-600',
      change: 'Configuradas',
      changeColor: 'text-gray-600'
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-cyan-600',
      change: metrics.conversionRate > 20 ? 'Excelente' : 'Em desenvolvimento',
      changeColor: metrics.conversionRate > 20 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      title: 'Crescimento Mensal',
      value: `${metrics.monthlyGrowth}%`,
      icon: BarChart3,
      color: 'text-rose-600',
      change: 'vs. mês anterior',
      changeColor: metrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Melhor Fonte',
      value: metrics.topPerformingSource,
      icon: Clock,
      color: 'text-amber-600',
      change: 'Maior volume',
      changeColor: 'text-gray-600',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {widget.title}
            </CardTitle>
            <widget.icon className={`h-4 w-4 ${widget.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${widget.isText ? 'text-sm' : ''}`}>
              {widget.value}
            </div>
            <p className={`text-xs ${widget.changeColor} mt-1`}>
              {widget.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsWidgets;
