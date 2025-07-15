
import { useState, useEffect, useMemo } from 'react';

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

export interface FunnelData {
  stages: FunnelStage[];
  conversionRate: number;
  status: 'improving' | 'declining' | 'stable';
}

export type FunnelType = 'sales' | 'ltv' | 'production';

const mockFunnelData: Record<FunnelType, FunnelData> = {
  sales: {
    stages: [
      { name: 'Leads', value: 1000, color: '#3b82f6' },
      { name: 'Qualificados', value: 750, color: '#8b5cf6' },
      { name: 'Propostas', value: 400, color: '#06b6d4' },
      { name: 'Negociação', value: 200, color: '#f59e0b' },
      { name: 'Fechados', value: 120, color: '#10b981' }
    ],
    conversionRate: 12,
    status: 'improving'
  },
  ltv: {
    stages: [
      { name: 'Novos', value: 500, color: '#3b82f6' },
      { name: 'Ativos', value: 350, color: '#8b5cf6' },
      { name: 'Engajados', value: 250, color: '#06b6d4' },
      { name: 'Fiéis', value: 150, color: '#f59e0b' },
      { name: 'Longos', value: 80, color: '#10b981' }
    ],
    conversionRate: 16,
    status: 'stable'
  },
  production: {
    stages: [
      { name: 'Pedidos', value: 300, color: '#3b82f6' },
      { name: 'Planejados', value: 250, color: '#8b5cf6' },
      { name: 'Produção', value: 180, color: '#06b6d4' },
      { name: 'Revisão', value: 120, color: '#f59e0b' },
      { name: 'Concluídos', value: 100, color: '#10b981' }
    ],
    conversionRate: 33,
    status: 'declining'
  }
};

export const useFunnelData = (type: FunnelType) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const data = useMemo(() => mockFunnelData[type], [type]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
};
