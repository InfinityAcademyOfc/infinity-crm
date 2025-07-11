
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { logError } from '@/utils/logger';

export type FunnelType = 'sales' | 'ltv' | 'production';

export interface FunnelStage {
  name: string;
  value: number;
  leakage?: number;
  efficiency?: number;
}

export interface FunnelData {
  stages: FunnelStage[];
  conversionRate: number;
}

export const useFunnelData = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<FunnelType>('sales');
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Memoizar o tema para evitar re-renders desnecessários
  const isDark = useMemo(() => {
    return theme === 'dark';
  }, [theme]);

  // Dados mockados memoizados
  const funnelData = useMemo<Record<FunnelType, FunnelData>>(() => {
    return {
      sales: {
        stages: [
          { name: 'Leads', value: 1250, leakage: 15, efficiency: 85 },
          { name: 'Qualificados', value: 856, leakage: 22, efficiency: 78 },
          { name: 'Propostas', value: 423, leakage: 35, efficiency: 65 },
          { name: 'Negociação', value: 198, leakage: 28, efficiency: 72 },
          { name: 'Fechamento', value: 89, leakage: 12, efficiency: 88 }
        ],
        conversionRate: 7.1
      },
      ltv: {
        stages: [
          { name: 'Novos Clientes', value: 89, leakage: 8, efficiency: 92 },
          { name: 'Ativos 30d', value: 82, leakage: 12, efficiency: 88 },
          { name: 'Recorrentes', value: 65, leakage: 18, efficiency: 82 },
          { name: 'Advocates', value: 34, leakage: 25, efficiency: 75 },
          { name: 'VIPs', value: 21, leakage: 15, efficiency: 85 }
        ],
        conversionRate: 23.6
      },
      production: {
        stages: [
          { name: 'Planejamento', value: 45, leakage: 5, efficiency: 95 },
          { name: 'Desenvolvimento', value: 42, leakage: 18, efficiency: 82 },
          { name: 'Testes', value: 35, leakage: 22, efficiency: 78 },
          { name: 'Aprovação', value: 28, leakage: 8, efficiency: 92 },
          { name: 'Entrega', value: 26, leakage: 3, efficiency: 97 }
        ],
        conversionRate: 57.8
      }
    };
  }, []);

  // Simular carregamento com cache
  useEffect(() => {
    const loadData = async () => {
      const now = Date.now();
      // Cache por 2 minutos
      if (now - lastFetch < 2 * 60 * 1000) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 300));
        setLastFetch(now);
      } catch (error) {
        logError('Erro ao carregar dados do funil', error, { component: 'useFunnelData' });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [lastFetch]);

  const handleSetActiveTab = useCallback((tab: FunnelType) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    setActiveTab: handleSetActiveTab,
    funnelData,
    isDark,
    isLoading
  };
};

export const getColorsByType = (type: FunnelType, isDark: boolean) => {
  const colors = {
    sales: {
      efficiency: isDark ? '#22c55e' : '#16a34a',
      leakage: isDark ? '#ef4444' : '#dc2626'
    },
    ltv: {
      efficiency: isDark ? '#8b5cf6' : '#7c3aed',
      leakage: isDark ? '#f59e0b' : '#d97706'
    },
    production: {
      efficiency: isDark ? '#06b6d4' : '#0891b2',
      leakage: isDark ? '#ec4899' : '#db2777'
    }
  };

  return { [type]: colors[type] };
};
