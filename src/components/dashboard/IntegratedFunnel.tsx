
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Filter, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { useModuleSync } from '@/services/moduleSyncService';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FunnelType = 'sales' | 'ltv' | 'production';

interface FunnelStage {
  name: string;
  count: number;
  efficiency: number;
  leakage: number;
}

interface FunnelData {
  type: FunnelType;
  stages: FunnelStage[];
  totalItems: number;
  conversionRate: number;
}

const IntegratedFunnel = () => {
  const [activeTab, setActiveTab] = useState<FunnelType>('sales');
  const [funnelData, setFunnelData] = useState<Record<FunnelType, FunnelData>>({
    sales: { type: 'sales', stages: [], totalItems: 0, conversionRate: 0 },
    ltv: { type: 'ltv', stages: [], totalItems: 0, conversionRate: 0 },
    production: { type: 'production', stages: [], totalItems: 0, conversionRate: 0 }
  });
  
  const { lastSyncTime } = useModuleSync();
  
  // Effect to update funnel data when syncModule is called
  useEffect(() => {
    updateFunnelData();
  }, [lastSyncTime]);
  
  const updateFunnelData = () => {
    // This would typically fetch data from the unified data store
    // For now, let's create mock data based on what would be in a real app
    
    // Sales funnel
    const salesStages: FunnelStage[] = [
      { name: 'Prospecção', count: 45, efficiency: 78, leakage: 22 },
      { name: 'Qualificação', count: 32, efficiency: 71, leakage: 29 },
      { name: 'Proposta', count: 24, efficiency: 75, leakage: 25 },
      { name: 'Negociação', count: 18, efficiency: 72, leakage: 28 },
      { name: 'Fechamento', count: 12, efficiency: 67, leakage: 33 }
    ];
    
    // LTV funnel
    const ltvStages: FunnelStage[] = [
      { name: 'Novos Clientes', count: 28, efficiency: 82, leakage: 18 },
      { name: 'Clientes Ativos', count: 36, efficiency: 90, leakage: 10 },
      { name: 'Clientes em Crescimento', count: 22, efficiency: 85, leakage: 15 },
      { name: 'Clientes Fiéis', count: 18, efficiency: 94, leakage: 6 },
      { name: 'Advogados da Marca', count: 12, efficiency: 92, leakage: 8 }
    ];
    
    // Production funnel
    const productionStages: FunnelStage[] = [
      { name: 'Backlog', count: 32, efficiency: 72, leakage: 28 },
      { name: 'Em Progresso', count: 18, efficiency: 83, leakage: 17 },
      { name: 'Revisão', count: 12, efficiency: 75, leakage: 25 },
      { name: 'Concluído', count: 42, efficiency: 95, leakage: 5 }
    ];
    
    setFunnelData({
      sales: { 
        type: 'sales', 
        stages: salesStages, 
        totalItems: salesStages.reduce((acc, stage) => acc + stage.count, 0),
        conversionRate: (salesStages[salesStages.length - 1].count / salesStages[0].count) * 100
      },
      ltv: { 
        type: 'ltv', 
        stages: ltvStages, 
        totalItems: ltvStages.reduce((acc, stage) => acc + stage.count, 0),
        conversionRate: (ltvStages[ltvStages.length - 1].count / ltvStages[0].count) * 100
      },
      production: { 
        type: 'production', 
        stages: productionStages, 
        totalItems: productionStages.reduce((acc, stage) => acc + stage.count, 0),
        conversionRate: (productionStages[productionStages.length - 1].count / productionStages[0].count) * 100
      }
    });
  };
  
  const getActiveData = () => funnelData[activeTab];
  
  const getFunnelIcon = (type: FunnelType) => {
    switch (type) {
      case 'sales': return <Filter className="mr-2 h-4 w-4 text-blue-500" />;
      case 'ltv': return <Users className="mr-2 h-4 w-4 text-purple-500" />;
      case 'production': return <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />;
      default: return <Filter className="mr-2 h-4 w-4" />;
    }
  };
  
  const getFunnelTitle = (type: FunnelType) => {
    switch (type) {
      case 'sales': return 'Funil de Vendas';
      case 'ltv': return 'Funil de LTV';
      case 'production': return 'Funil de Produção';
      default: return 'Funil';
    }
  };
  
  return (
    <Card className="shadow-md border border-border/60 bg-card/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Funil Integrado</CardTitle>
          <Badge variant="outline" className="ml-2 flex items-center">
            <TrendingUp className="mr-1 h-3 w-3" /> 
            Conv: {getActiveData().conversionRate.toFixed(1)}%
          </Badge>
        </div>
        <CardDescription>
          Visão unificada dos funis de vendas, clientes e produção
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FunnelType)} className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="sales" className="flex items-center justify-center">
              <Filter className="mr-2 h-4 w-4" /> Vendas
            </TabsTrigger>
            <TabsTrigger value="ltv" className="flex items-center justify-center">
              <Users className="mr-2 h-4 w-4" /> LTV
            </TabsTrigger>
            <TabsTrigger value="production" className="flex items-center justify-center">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Produção
            </TabsTrigger>
          </TabsList>
          
          {Object.keys(funnelData).map((type) => (
            <TabsContent key={type} value={type} className="space-y-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={funnelData[type as FunnelType].stages}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'count' ? `${value} itens` : 
                        name === 'efficiency' ? `${value}% eficiência` : 
                        `${value}% fugas`,
                        name === 'count' ? 'Quantidade' : 
                        name === 'efficiency' ? 'Eficiência' : 
                        'Fugas'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="#4361ee" name="Quantidade" />
                    <Bar dataKey="efficiency" fill="#06d6a0" name="Eficiência" />
                    <Bar dataKey="leakage" fill="#ef476f" name="Fugas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center border rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {funnelData[type as FunnelType].totalItems}
                  </p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conversão</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">
                    {funnelData[type as FunnelType].conversionRate.toFixed(1)}%
                  </p>
                </div>
                <div className="flex flex-col items-center border rounded-lg p-2 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fugas</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">
                    {(100 - funnelData[type as FunnelType].conversionRate).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              {funnelData[type as FunnelType].stages.some(stage => stage.leakage > 30) && (
                <div className="flex items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <span>Atenção: Algumas etapas possuem fugas acima de 30%</span>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegratedFunnel;
