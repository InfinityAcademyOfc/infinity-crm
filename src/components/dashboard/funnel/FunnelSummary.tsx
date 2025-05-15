
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { type FunnelData, type FunnelType } from '@/hooks/useFunnelData';
import MetricCard from './MetricCard';

interface FunnelSummaryProps {
  type: FunnelType;
  data: FunnelData;
}

const FunnelSummary = ({ type, data }: FunnelSummaryProps) => {
  // Verificação de segurança para garantir que data existe
  if (!data || !data.stages || data.stages.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Dados não disponíveis
      </div>
    );
  }

  // Cálculos de métricas com segurança contra undefined
  const totalLeads = data.stages[0]?.value || 0;
  const conversions = data.stages[data.stages.length - 1]?.value || 0;
  const conversionRate = data.conversionRate || 0;

  // Métricas por tipo de funil
  const getMetrics = () => {
    switch (type) {
      case 'sales':
        return {
          primary: {
            label: "Conv. Total",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            bgClass: "bg-blue-50 dark:bg-blue-900/20",
            borderClass: "border border-blue-200 dark:border-blue-800",
            textClass: "text-blue-700 dark:text-blue-300"
          },
          secondary: {
            label: "Leads",
            value: totalLeads,
            icon: TrendingUp,
            bgClass: "bg-purple-50 dark:bg-purple-900/20",
            borderClass: "border border-purple-200 dark:border-purple-800",
            textClass: "text-purple-700 dark:text-purple-300"
          },
          tertiary: {
            label: "Fechados",
            value: conversions,
            icon: data.status === 'improving' ? TrendingUp : data.status === 'declining' ? TrendingDown : Minus,
            bgClass: "bg-green-50 dark:bg-green-900/20",
            borderClass: "border border-green-200 dark:border-green-800",
            textClass: "text-green-700 dark:text-green-300"
          }
        };
      case 'ltv':
        return {
          primary: {
            label: "Retenção",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            bgClass: "bg-purple-50 dark:bg-purple-900/20",
            borderClass: "border border-purple-200 dark:border-purple-800",
            textClass: "text-purple-700 dark:text-purple-300"
          },
          secondary: {
            label: "Novos",
            value: totalLeads,
            icon: TrendingUp,
            bgClass: "bg-blue-50 dark:bg-blue-900/20",
            borderClass: "border border-blue-200 dark:border-blue-800",
            textClass: "text-blue-700 dark:text-blue-300"
          },
          tertiary: {
            label: "Longos",
            value: conversions,
            icon: data.status === 'improving' ? TrendingUp : data.status === 'declining' ? TrendingDown : Minus,
            bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
            borderClass: "border border-indigo-200 dark:border-indigo-800",
            textClass: "text-indigo-700 dark:text-indigo-300"
          }
        };
      case 'production':
        return {
          primary: {
            label: "Eficiência",
            value: `${conversionRate}%`,
            icon: TrendingUp,
            bgClass: "bg-cyan-50 dark:bg-cyan-900/20",
            borderClass: "border border-cyan-200 dark:border-cyan-800",
            textClass: "text-cyan-700 dark:text-cyan-300"
          },
          secondary: {
            label: "Pedidos",
            value: totalLeads,
            icon: TrendingUp,
            bgClass: "bg-sky-50 dark:bg-sky-900/20",
            borderClass: "border border-sky-200 dark:border-sky-800",
            textClass: "text-sky-700 dark:text-sky-300"
          },
          tertiary: {
            label: "Concluídos",
            value: conversions,
            icon: data.status === 'improving' ? TrendingUp : data.status === 'declining' ? TrendingDown : Minus,
            bgClass: "bg-teal-50 dark:bg-teal-900/20",
            borderClass: "border border-teal-200 dark:border-teal-800",
            textClass: "text-teal-700 dark:text-teal-300"
          }
        };
      default:
        return {
          primary: {
            label: "Métrica 1",
            value: "0",
            icon: Minus,
            bgClass: "bg-gray-50 dark:bg-gray-900/20",
            borderClass: "border border-gray-200 dark:border-gray-800",
            textClass: "text-gray-700 dark:text-gray-300"
          },
          secondary: {
            label: "Métrica 2",
            value: "0",
            icon: Minus,
            bgClass: "bg-gray-50 dark:bg-gray-900/20",
            borderClass: "border border-gray-200 dark:border-gray-800",
            textClass: "text-gray-700 dark:text-gray-300"
          },
          tertiary: {
            label: "Métrica 3",
            value: "0",
            icon: Minus,
            bgClass: "bg-gray-50 dark:bg-gray-900/20",
            borderClass: "border border-gray-200 dark:border-gray-800",
            textClass: "text-gray-700 dark:text-gray-300"
          }
        };
    }
  };
  
  const metrics = getMetrics();

  return (
    <div className="grid grid-cols-3 gap-2">
      <MetricCard {...metrics.primary} />
      <MetricCard {...metrics.secondary} />
      <MetricCard {...metrics.tertiary} />
    </div>
  );
};

export default FunnelSummary;
