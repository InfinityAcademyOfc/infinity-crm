
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
  leakage?: number;
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
      { name: 'Leads', value: 1000, color: '#3b82f6', leakage: 25 },
      { name: 'Qualificados', value: 750, color: '#8b5cf6', leakage: 47 },
      { name: 'Propostas', value: 400, color: '#06b6d4', leakage: 50 },
      { name: 'Negociação', value: 200, color: '#f59e0b', leakage: 40 },
      { name: 'Fechados', value: 120, color: '#10b981', leakage: 0 }
    ],
    conversionRate: 12,
    status: 'improving'
  },
  ltv: {
    stages: [
      { name: 'Novos', value: 500, color: '#3b82f6', leakage: 30 },
      { name: 'Ativos', value: 350, color: '#8b5cf6', leakage: 29 },
      { name: 'Engajados', value: 250, color: '#06b6d4', leakage: 40 },
      { name: 'Fiéis', value: 150, color: '#f59e0b', leakage: 47 },
      { name: 'Longos', value: 80, color: '#10b981', leakage: 0 }
    ],
    conversionRate: 16,
    status: 'stable'
  },
  production: {
    stages: [
      { name: 'Pedidos', value: 300, color: '#3b82f6', leakage: 17 },
      { name: 'Planejados', value: 250, color: '#8b5cf6', leakage: 28 },
      { name: 'Produção', value: 180, color: '#06b6d4', leakage: 33 },
      { name: 'Revisão', value: 120, color: '#f59e0b', leakage: 17 },
      { name: 'Concluídos', value: 100, color: '#10b981', leakage: 0 }
    ],
    conversionRate: 33,
    status: 'declining'
  }
};

export const getColorsByType = (type: FunnelType, isDark: boolean) => {
  const colors = {
    sales: {
      primary: isDark ? '#60a5fa' : '#3b82f6',
      secondary: isDark ? '#a78bfa' : '#8b5cf6',
      efficiency: '#22c55e',
      leakage: '#ef4444'
    },
    ltv: {
      primary: isDark ? '#a78bfa' : '#8b5cf6',
      secondary: isDark ? '#60a5fa' : '#3b82f6',
      efficiency: '#22c55e',
      leakage: '#ef4444'
    },
    production: {
      primary: isDark ? '#67e8f9' : '#06b6d4',
      secondary: isDark ? '#60a5fa' : '#3b82f6',
      efficiency: '#22c55e',
      leakage: '#ef4444'
    }
  };
  
  return {
    [type]: colors[type]
  };
};

export const useFunnelData = (type?: FunnelType) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FunnelType>(type || 'sales');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const funnelData = useMemo(() => mockFunnelData, []);
  const data = useMemo(() => mockFunnelData[activeTab], [activeTab]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return { 
    data, 
    isLoading, 
    activeTab, 
    setActiveTab, 
    funnelData, 
    isDark 
  };
};
