
import { useCallback, useEffect, useState } from 'react';

export type FunnelType = 'sales' | 'ltv' | 'production';

export interface FunnelStage {
  name: string;
  value: number;
  conversion?: number;
  leakage?: number;
}

export interface FunnelData {
  stages: FunnelStage[];
  conversionRate: number;
}

interface FunnelDataState {
  sales: FunnelData;
  ltv: FunnelData;
  production: FunnelData;
}

export const getColorsByType = (type: FunnelType, isDark: boolean) => {
  const colorMaps = {
    sales: {
      primary: isDark ? '#4361ee' : '#3b82f6',
      secondary: isDark ? '#3a0ca3' : '#2563eb',
      efficiency: isDark ? '#22c55e' : '#16a34a',
      leakage: isDark ? '#ef4444' : '#dc2626',
    },
    ltv: {
      primary: isDark ? '#7209b7' : '#8b5cf6',
      secondary: isDark ? '#560bad' : '#7c3aed',
      efficiency: isDark ? '#22c55e' : '#16a34a',
      leakage: isDark ? '#ef4444' : '#dc2626',
    },
    production: {
      primary: isDark ? '#4cc9f0' : '#06b6d4',
      secondary: isDark ? '#0096c7' : '#0891b2',
      efficiency: isDark ? '#22c55e' : '#16a34a',
      leakage: isDark ? '#ef4444' : '#dc2626',
    },
  };

  return colorMaps;
};

export const useFunnelData = () => {
  const [activeTab, setActiveTab] = useState<FunnelType>('sales');
  const [funnelData, setFunnelData] = useState<FunnelDataState>({
    sales: {
      stages: [],
      conversionRate: 0,
    },
    ltv: {
      stages: [],
      conversionRate: 0,
    },
    production: {
      stages: [],
      conversionRate: 0,
    },
  });
  
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    matchMedia.addEventListener('change', handleChange);

    return () => matchMedia.removeEventListener('change', handleChange);
  }, []);

  const fetchFunnelData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Simulate fetching data
      await new Promise(resolve => setTimeout(resolve, 100));

      setFunnelData({
        sales: {
          stages: [
            { name: 'Leads', value: 240, conversion: 75, leakage: 25 },
            { name: 'Qualified', value: 180, conversion: 66, leakage: 34 },
            { name: 'Meetings', value: 120, conversion: 83, leakage: 17 },
            { name: 'Proposals', value: 100, conversion: 60, leakage: 40 },
            { name: 'Closed', value: 60, conversion: 100, leakage: 0 },
          ],
          conversionRate: 25
        },
        ltv: {
          stages: [
            { name: 'First Sale', value: 200, conversion: 65, leakage: 35 },
            { name: 'Repeated', value: 130, conversion: 77, leakage: 23 },
            { name: 'Upsell', value: 100, conversion: 50, leakage: 50 },
            { name: 'Loyal', value: 50, conversion: 100, leakage: 0 }
          ],
          conversionRate: 25
        },
        production: {
          stages: [
            { name: 'Planning', value: 180, conversion: 89, leakage: 11 },
            { name: 'Execution', value: 160, conversion: 75, leakage: 25 },
            { name: 'Review', value: 120, conversion: 92, leakage: 8 },
            { name: 'Delivery', value: 110, conversion: 100, leakage: 0 }
          ],
          conversionRate: 61
        }
      });
    } catch (error) {
      console.error('Error fetching funnel data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunnelData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchFunnelData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchFunnelData]);

  return {
    activeTab,
    setActiveTab,
    funnelData,
    isDark,
    isLoading
  };
};
