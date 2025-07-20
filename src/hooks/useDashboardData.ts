
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Optimized mock data for immediate rendering
const mockSalesData = [
  { month: 'Jan', value: 12000, period: '30d', collaborator: 'João', product: 'Produto A' },
  { month: 'Feb', value: 15000, period: '30d', collaborator: 'Maria', product: 'Produto B' },
  { month: 'Mar', value: 18000, period: '30d', collaborator: 'Pedro', product: 'Produto A' },
  { month: 'Apr', value: 14000, period: '60d', collaborator: 'Ana', product: 'Produto C' },
  { month: 'May', value: 22000, period: '60d', collaborator: 'João', product: 'Produto B' },
  { month: 'Jun', value: 25000, period: '90d', collaborator: 'Maria', product: 'Produto A' }
];

export const useDashboardData = () => {
  const { user, companyProfile } = useAuth();
  const [filterPeriod, setFilterPeriod] = useState('30d');
  const [filterCollaborator, setFilterCollaborator] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');

  // Always loaded for immediate rendering
  const isLoaded = true;

  // Memoized user name for performance
  const userName = useMemo(() => {
    return user?.user_metadata?.name || 
           companyProfile?.name || 
           user?.email?.split('@')[0] || 
           'Usuário';
  }, [user, companyProfile]);

  // Optimized filtered data with memoization
  const filteredSalesData = useMemo(() => {
    return mockSalesData.filter(item => {
      const periodFilter = filterPeriod === 'all' || item.period === filterPeriod;
      const collaboratorFilter = filterCollaborator === 'all' || item.collaborator === filterCollaborator;
      const productFilter = filterProduct === 'all' || item.product === filterProduct;
      
      return periodFilter && collaboratorFilter && productFilter;
    });
  }, [filterPeriod, filterCollaborator, filterProduct]);

  // Memoized callbacks to prevent re-renders
  const handlePeriodChange = useCallback((period: string) => {
    setFilterPeriod(period);
  }, []);

  const handleCollaboratorChange = useCallback((collaborator: string) => {
    setFilterCollaborator(collaborator);
  }, []);

  const handleProductChange = useCallback((product: string) => {
    setFilterProduct(product);
  }, []);

  return {
    userName,
    isLoaded,
    filteredSalesData,
    filterPeriod,
    filterCollaborator,
    filterProduct,
    handlePeriodChange,
    handleCollaboratorChange,
    handleProductChange
  };
};
