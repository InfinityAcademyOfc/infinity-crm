
import { useState, useEffect } from 'react';
import { useModuleSync } from '@/services/moduleSyncService';

export type FunnelType = 'sales' | 'ltv' | 'production';

export interface FunnelStage {
  name: string;
  value: number;
  efficiency: number;
  leakage: number;
  fill?: string;
}

export interface FunnelData {
  type: FunnelType;
  stages: FunnelStage[];
  totalItems: number;
  conversionRate: number;
}

export const getColorsByType = (type: FunnelType, isDark: boolean) => {
  const colorSets = {
    sales: {
      main: '#4361ee',
      efficiency: '#06d6a0',
      leakage: '#ef476f',
      gradient: ['#4361ee', '#3a56e4', '#314bdb', '#2740d1', '#1d35c8'],
      dark: ['#5D72F2', '#5369ED', '#4960E8', '#3F57E3', '#354EDF']
    },
    ltv: {
      main: '#9d4edd',
      efficiency: '#06d6a0',
      leakage: '#ef476f',
      gradient: ['#9d4edd', '#8a45c9', '#773cb4', '#64339f', '#512a8b'],
      dark: ['#AE64E7', '#9E5AD7', '#8E51C7', '#7E47B7', '#6E3DA7'] 
    },
    production: {
      main: '#4cc9f0',
      efficiency: '#06d6a0',
      leakage: '#ef476f',
      gradient: ['#4cc9f0', '#43b4d9', '#3a9fc1', '#318baa', '#287792'],
      dark: ['#65D2F9', '#5CBDE4', '#53A8CF', '#4A93BA', '#417EA5']
    }
  };
  
  return isDark ? {
    ...colorSets,
    [type]: {
      ...colorSets[type],
      gradient: colorSets[type].dark
    }
  } : colorSets;
};

export const useFunnelData = () => {
  const [activeTab, setActiveTab] = useState<FunnelType>('sales');
  const [funnelData, setFunnelData] = useState<Record<FunnelType, FunnelData>>({
    sales: { type: 'sales', stages: [], totalItems: 0, conversionRate: 0 },
    ltv: { type: 'ltv', stages: [], totalItems: 0, conversionRate: 0 },
    production: { type: 'production', stages: [], totalItems: 0, conversionRate: 0 }
  });
  const { lastSyncTime } = useModuleSync();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateFunnelData();
  }, [lastSyncTime]);

  const updateFunnelData = () => {
    const colorSets = getColorsByType(activeTab, isDark);
    
    const salesStages: FunnelStage[] = [
      { name: 'Prospecção', value: 45, efficiency: 78, leakage: 22, fill: colorSets.sales.gradient[0] },
      { name: 'Qualificação', value: 32, efficiency: 71, leakage: 29, fill: colorSets.sales.gradient[1] },
      { name: 'Proposta', value: 24, efficiency: 75, leakage: 25, fill: colorSets.sales.gradient[2] },
      { name: 'Negociação', value: 18, efficiency: 72, leakage: 28, fill: colorSets.sales.gradient[3] },
      { name: 'Fechamento', value: 12, efficiency: 67, leakage: 33, fill: colorSets.sales.gradient[4] }
    ];
    
    const ltvStages: FunnelStage[] = [
      { name: 'Novos Clientes', value: 28, efficiency: 82, leakage: 18, fill: colorSets.ltv.gradient[0] },
      { name: 'Clientes Ativos', value: 36, efficiency: 90, leakage: 10, fill: colorSets.ltv.gradient[1] },
      { name: 'Clientes em Crescimento', value: 22, efficiency: 85, leakage: 15, fill: colorSets.ltv.gradient[2] },
      { name: 'Clientes Fiéis', value: 18, efficiency: 94, leakage: 6, fill: colorSets.ltv.gradient[3] },
      { name: 'Advogados da Marca', value: 12, efficiency: 92, leakage: 8, fill: colorSets.ltv.gradient[4] }
    ];
    
    const productionStages: FunnelStage[] = [
      { name: 'Backlog', value: 32, efficiency: 72, leakage: 28, fill: colorSets.production.gradient[0] },
      { name: 'Em Progresso', value: 18, efficiency: 83, leakage: 17, fill: colorSets.production.gradient[1] },
      { name: 'Revisão', value: 12, efficiency: 75, leakage: 25, fill: colorSets.production.gradient[2] },
      { name: 'Concluído', value: 42, efficiency: 95, leakage: 5, fill: colorSets.production.gradient[3] }
    ];
    
    setFunnelData({
      sales: { 
        type: 'sales', 
        stages: salesStages, 
        totalItems: salesStages.reduce((acc, stage) => acc + stage.value, 0),
        conversionRate: Math.round((salesStages[salesStages.length - 1].value / salesStages[0].value) * 100)
      },
      ltv: { 
        type: 'ltv', 
        stages: ltvStages, 
        totalItems: ltvStages.reduce((acc, stage) => acc + stage.value, 0),
        conversionRate: Math.round((ltvStages[ltvStages.length - 1].value / ltvStages[0].value) * 100)
      },
      production: { 
        type: 'production', 
        stages: productionStages, 
        totalItems: productionStages.reduce((acc, stage) => acc + stage.value, 0),
        conversionRate: Math.round((productionStages[productionStages.length - 1].value / productionStages[0].value) * 100)
      }
    });
  };

  return {
    activeTab,
    setActiveTab,
    funnelData,
    isDark
  };
};
