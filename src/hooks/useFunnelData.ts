
import { useState, useEffect } from 'react';
import { useThemeManager } from './useThemeManager';

// Tipos
export type FunnelType = 'sales' | 'ltv' | 'production';

export type FunnelStage = {
  name: string;
  value: number;
  efficiency?: number;
  leakage?: number;
};

export type FunnelData = {
  stages: FunnelStage[];
  conversionRate: number;
  status: 'improving' | 'stable' | 'declining';
};

export type FunnelDataMap = Record<FunnelType, FunnelData>;

// Dados mockados para os diferentes tipos de funil
const mockFunnelData: FunnelDataMap = {
  sales: {
    stages: [
      { name: 'Leads', value: 1200, efficiency: 65, leakage: 35 },
      { name: 'Qualificados', value: 780, efficiency: 78, leakage: 22 },
      { name: 'Reuniões', value: 610, efficiency: 54, leakage: 46 },
      { name: 'Propostas', value: 320, efficiency: 62, leakage: 38 },
      { name: 'Fechamentos', value: 200, efficiency: 85, leakage: 15 },
    ],
    conversionRate: 16.7,
    status: 'improving'
  },
  ltv: {
    stages: [
      { name: 'Novos', value: 850, efficiency: 90, leakage: 10 },
      { name: '3 meses', value: 765, efficiency: 88, leakage: 12 },
      { name: '6 meses', value: 670, efficiency: 76, leakage: 24 },
      { name: '1 ano', value: 510, efficiency: 80, leakage: 20 },
      { name: '2+ anos', value: 408, efficiency: 95, leakage: 5 },
    ],
    conversionRate: 48,
    status: 'stable'
  },
  production: {
    stages: [
      { name: 'Pedidos', value: 320, efficiency: 100, leakage: 0 },
      { name: 'Produção', value: 320, efficiency: 94, leakage: 6 },
      { name: 'QA', value: 300, efficiency: 93, leakage: 7 },
      { name: 'Entrega', value: 280, efficiency: 98, leakage: 2 },
      { name: 'Instalação', value: 275, efficiency: 100, leakage: 0 },
    ],
    conversionRate: 85.9,
    status: 'stable'
  }
};

// Função para obter as cores para cada tipo de funil com base no tema
export const getColorsByType = (type: FunnelType, isDark: boolean) => {
  const darkModeColors = {
    sales: {
      primary: '#4361ee',
      secondary: '#3a0ca3',
      efficiency: '#22c55e',
      leakage: '#ef4444'
    },
    ltv: {
      primary: '#7209b7',
      secondary: '#9d4edd',
      efficiency: '#14b8a6',
      leakage: '#f43f5e'
    },
    production: {
      primary: '#4cc9f0',
      secondary: '#0096c7',
      efficiency: '#06b6d4',
      leakage: '#f97316'
    }
  };

  const lightModeColors = {
    sales: {
      primary: '#4361ee',
      secondary: '#5e60ce',
      efficiency: '#22c55e',
      leakage: '#ef4444'
    },
    ltv: {
      primary: '#7209b7',
      secondary: '#9d4edd',
      efficiency: '#14b8a6',
      leakage: '#f43f5e'
    },
    production: {
      primary: '#4cc9f0',
      secondary: '#0096c7',
      efficiency: '#06b6d4',
      leakage: '#f97316'
    }
  };

  return isDark ? darkModeColors : lightModeColors;
};

// Hook personalizado para gerenciar os dados do funil
export const useFunnelData = () => {
  const [activeTab, setActiveTab] = useState<FunnelType>('sales');
  const [funnelData, setFunnelData] = useState<FunnelDataMap>(mockFunnelData);
  const { isDark } = useThemeManager();

  useEffect(() => {
    // Simulando uma API call para buscar dados - em uma app real, isso seria uma chamada à API
    const fetchFunnelData = async () => {
      try {
        // Simula o tempo de resposta de uma API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // No mundo real, aqui você buscaria dados da sua API
        // Para fins de demonstração, usamos nossos dados mockados
        setFunnelData(mockFunnelData);
      } catch (error) {
        console.error("Erro ao carregar dados do funil:", error);
        // Em caso de erro, inicialize com dados vazios mas válidos
        setFunnelData({
          sales: { stages: [], conversionRate: 0, status: 'stable' },
          ltv: { stages: [], conversionRate: 0, status: 'stable' },
          production: { stages: [], conversionRate: 0, status: 'stable' }
        });
      }
    };

    fetchFunnelData();
  }, []);

  return {
    activeTab,
    setActiveTab,
    funnelData,
    isDark
  };
};
