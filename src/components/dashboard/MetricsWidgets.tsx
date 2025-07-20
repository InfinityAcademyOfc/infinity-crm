
import React, { useMemo } from 'react';
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
import { formatCurrency } from '@/lib/formatters';

// Default metrics for immediate rendering
const defaultMetrics = {
  totalLeads: 0,
  totalClients: 0,
  totalRevenue: 0,
  completedTasks: 0,
  pendingTasks: 0,
  activeFunnelStages: 4,
  conversionRate: 0,
  monthlyGrowth: 0,
  topPerformingSource: 'WhatsApp'
};

const MetricsWidgets = React.memo(() => {
  const { metrics, isLoading } = useDashboardMetrics();
  
  // Use default metrics immediately, update with real data when available
  const displayMetrics = isLoading ? defaultMetrics : metrics;

  const widgets = useMemo(() => [
    {
      title: 'Total de Leads',
      value: displayMetrics.totalLeads,
      icon: Target,
      color: 'text-blue-600',
      change: `+${displayMetrics.monthlyGrowth}%`,
      changeColor: displayMetrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Clientes Ativos',
      value: displayMetrics.totalClients,
      icon: Users,
      color: 'text-purple-600',
      change: `Taxa Conv: ${displayMetrics.conversionRate}%`,
      changeColor: 'text-gray-600'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(displayMetrics.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      change: 'Este período',
      changeColor: 'text-gray-600'
    },
    {
      title: 'Tarefas Concluídas',
      value: displayMetrics.completedTasks,
      icon: CheckCircle,
      color: 'text-emerald-600',
      change: `${displayMetrics.pendingTasks} pendentes`,
      changeColor: 'text-orange-600'
    },
    {
      title: 'Etapas do Funil',
      value: displayMetrics.activeFunnelStages,
      icon: Filter,
      color: 'text-indigo-600',
      change: 'Configuradas',
      changeColor: 'text-gray-600'
    },
    {
      title: 'Taxa de Conversão',
      value: `${displayMetrics.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-cyan-600',
      change: displayMetrics.conversionRate > 20 ? 'Excelente' : 'Em desenvolvimento',
      changeColor: displayMetrics.conversionRate > 20 ? 'text-green-600' : 'text-yellow-600'
    },
    {
      title: 'Crescimento Mensal',
      value: `${displayMetrics.monthlyGrowth}%`,
      icon: BarChart3,
      color: 'text-rose-600',
      change: 'vs. mês anterior',
      changeColor: displayMetrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Melhor Fonte',
      value: displayMetrics.topPerformingSource,
      icon: Clock,
      color: 'text-amber-600',
      change: 'Maior volume',
      changeColor: 'text-gray-600',
      isText: true
    }
  ], [displayMetrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {widgets.map((widget, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
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
});

MetricsWidgets.displayName = 'MetricsWidgets';

export default MetricsWidgets;
