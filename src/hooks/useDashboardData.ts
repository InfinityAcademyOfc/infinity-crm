
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockSalesData, mockTodayActivities } from '@/data/mockData';
import { logError } from '@/utils/logger';

export const useDashboardData = () => {
  const { user, companyProfile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('30d');
  const [filterCollaborator, setFilterCollaborator] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');

  // Memoizar o nome do usuário para evitar re-renders desnecessários
  const userName = useMemo(() => {
    return user?.user_metadata?.name || 
           companyProfile?.name || 
           user?.email?.split('@')[0] || 
           'Usuário';
  }, [user, companyProfile]);

  // Memoizar dados filtrados para evitar recálculos desnecessários
  const filteredSalesData = useMemo(() => {
    try {
      return mockSalesData.filter(item => {
        const periodFilter = filterPeriod === 'all' || item.period === filterPeriod;
        const collaboratorFilter = filterCollaborator === 'all' || item.collaborator === filterCollaborator;
        const productFilter = filterProduct === 'all' || item.product === filterProduct;
        
        return periodFilter && collaboratorFilter && productFilter;
      });
    } catch (error) {
      logError('Erro ao filtrar dados de vendas', error, { component: 'useDashboardData' });
      return [];
    }
  }, [filterPeriod, filterCollaborator, filterProduct]);

  // Usar useCallback para evitar re-criação de funções
  const handlePeriodChange = useCallback((period: string) => {
    setFilterPeriod(period);
  }, []);

  const handleCollaboratorChange = useCallback((collaborator: string) => {
    setFilterCollaborator(collaborator);
  }, []);

  const handleProductChange = useCallback((product: string) => {
    setFilterProduct(product);
  }, []);

  // Simular carregamento inicial uma única vez
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoaded(false);
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsLoaded(true);
      } catch (error) {
        logError('Erro ao carregar dados do dashboard', error, { component: 'useDashboardData' });
        setIsLoaded(true); // Ainda marcar como carregado para evitar loop infinito
      }
    };

    loadData();
  }, []); // Dependency array vazia para executar apenas uma vez

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
