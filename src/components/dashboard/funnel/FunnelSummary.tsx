
import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { type FunnelType, type FunnelData } from '@/hooks/useFunnelData';
import MetricCard from './MetricCard';

interface FunnelSummaryProps {
  type: FunnelType;
  data: FunnelData;
}

const FunnelSummary = ({ type, data }: FunnelSummaryProps) => {
  const totalLeakage = 100 - data.conversionRate;
  const averageEfficiency = Math.round(
    data.stages.reduce((sum, stage) => sum + stage.efficiency, 0) / data.stages.length
  );
  
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <MetricCard
        icon={BarChart3}
        label="Total"
        value={data.totalItems}
        bgClass="bg-blue-50 dark:bg-blue-900/20"
        borderClass="border border-blue-200 dark:border-blue-800"
        textClass="text-blue-700 dark:text-blue-300"
      />
      <MetricCard
        icon={TrendingUp}
        label="Eficiência"
        value={`${averageEfficiency}%`}
        bgClass="bg-green-50 dark:bg-green-900/20"
        borderClass="border border-green-200 dark:border-green-800"
        textClass="text-green-700 dark:text-green-300"
      />
      <MetricCard
        icon={TrendingDown}
        label="Fugas"
        value={`${totalLeakage}%`}
        bgClass="bg-red-50 dark:bg-red-900/20"
        borderClass="border border-red-200 dark:border-red-800"
        textClass="text-red-700 dark:text-red-300"
      />
    </div>
  );
};

export default FunnelSummary;
