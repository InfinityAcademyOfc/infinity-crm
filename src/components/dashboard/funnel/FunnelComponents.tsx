
import React, { memo } from 'react';
import FunnelChart from './FunnelChart';
import ConversionChart from './ConversionChart';
import LeakageChart from './LeakageChart';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { type FunnelStage, type FunnelData, type FunnelType } from '@/hooks/useFunnelData';

// Memoizar componentes para evitar re-renders desnecessários
export const MemoizedFunnelChart = memo(FunnelChart);
export const MemoizedConversionChart = memo(ConversionChart);
export const MemoizedLeakageChart = memo(LeakageChart);

// Exportar componentes com nomes originais
export { MemoizedFunnelChart as FunnelChart };
export { MemoizedConversionChart as ConversionChart };  
export { MemoizedLeakageChart as LeakageChart };

interface FunnelSummaryProps {
  type: FunnelType;
  data: FunnelData;
}

export const FunnelSummary = memo<FunnelSummaryProps>(({ type, data }) => {
  const totalInput = data.stages[0]?.value || 0;
  const totalOutput = data.stages[data.stages.length - 1]?.value || 0;
  const efficiency = totalInput > 0 ? Math.round((totalOutput / totalInput) * 100) : 0;

  const getTypeLabel = (type: FunnelType) => {
    switch (type) {
      case 'sales': return 'Vendas';
      case 'ltv': return 'LTV';
      case 'production': return 'Produção';
      default: return 'Funil';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Eficiência Geral</span>
        <Badge variant={efficiency >= 70 ? "default" : efficiency >= 50 ? "secondary" : "destructive"} className="text-xs">
          {efficiency >= 70 ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {efficiency}%
        </Badge>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {getTypeLabel(type)}: {totalOutput} de {totalInput}
      </div>
    </div>
  );
});

FunnelSummary.displayName = 'FunnelSummary';
