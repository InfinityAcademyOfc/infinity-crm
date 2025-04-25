
import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { type FunnelType, type FunnelData } from '@/hooks/useFunnelData';

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
      <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <BarChart3 className="h-3 w-3" />
          <span>Total</span>
        </div>
        <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
          {data.totalItems}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <TrendingUp className="h-3 w-3" />
          <span>Eficiência</span>
        </div>
        <p className="text-lg font-bold text-green-700 dark:text-green-300">
          {averageEfficiency}%
        </p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <TrendingDown className="h-3 w-3" />
          <span>Fugas</span>
        </div>
        <p className="text-lg font-bold text-red-700 dark:text-red-300">
          {totalLeakage}%
        </p>
      </div>
    </div>
  );
};

export default FunnelSummary;
