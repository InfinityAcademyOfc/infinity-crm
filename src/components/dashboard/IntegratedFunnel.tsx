
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { AlertTriangle, Filter, TrendingUp, Users, CheckCircle2, BarChart3, Activity, TrendingDown } from 'lucide-react';
import { useModuleSync } from '@/services/moduleSyncService';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type FunnelType = 'sales' | 'ltv' | 'production';

interface FunnelStage {
  name: string;
  value: number;
  efficiency: number;
  leakage: number;
  fill?: string; // Add fill property for colors
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
  const [isDark, setIsDark] = useState(false);
  
  // Effect to detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    // Check initial state
    checkDarkMode();
    
    // Create a mutation observer to detect class changes on document.documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
  
  // Effect to update funnel data when syncModule is called
  useEffect(() => {
    updateFunnelData();
  }, [lastSyncTime]);
  
  const updateFunnelData = () => {
    const colorSets = getColorsByType(activeTab);
    
    // Sales funnel
    const salesStages: FunnelStage[] = [
      { name: 'Prospecção', value: 45, efficiency: 78, leakage: 22, fill: colorSets.sales.gradient[0] },
      { name: 'Qualificação', value: 32, efficiency: 71, leakage: 29, fill: colorSets.sales.gradient[1] },
      { name: 'Proposta', value: 24, efficiency: 75, leakage: 25, fill: colorSets.sales.gradient[2] },
      { name: 'Negociação', value: 18, efficiency: 72, leakage: 28, fill: colorSets.sales.gradient[3] },
      { name: 'Fechamento', value: 12, efficiency: 67, leakage: 33, fill: colorSets.sales.gradient[4] }
    ];
    
    // LTV funnel
    const ltvStages: FunnelStage[] = [
      { name: 'Novos Clientes', value: 28, efficiency: 82, leakage: 18, fill: colorSets.ltv.gradient[0] },
      { name: 'Clientes Ativos', value: 36, efficiency: 90, leakage: 10, fill: colorSets.ltv.gradient[1] },
      { name: 'Clientes em Crescimento', value: 22, efficiency: 85, leakage: 15, fill: colorSets.ltv.gradient[2] },
      { name: 'Clientes Fiéis', value: 18, efficiency: 94, leakage: 6, fill: colorSets.ltv.gradient[3] },
      { name: 'Advogados da Marca', value: 12, efficiency: 92, leakage: 8, fill: colorSets.ltv.gradient[4] }
    ];
    
    // Production funnel
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

  const getColorsByType = (type: FunnelType) => {
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
  
  const getFunnelIcon = (type: FunnelType) => {
    const colors = {
      sales: "text-blue-500",
      ltv: "text-purple-500",
      production: "text-cyan-500"
    };
    
    switch (type) {
      case 'sales': return <Filter className={`h-4 w-4 ${colors.sales}`} />;
      case 'ltv': return <Users className={`h-4 w-4 ${colors.ltv}`} />;
      case 'production': return <CheckCircle2 className={`h-4 w-4 ${colors.production}`} />;
    }
  };
  
  const renderFunnelChart = (type: FunnelType) => {
    const data = funnelData[type].stages;
    const colors = getColorsByType(type);
    
    return (
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip 
              formatter={(value, name) => [`${value} itens`, 'Quantidade']}
              contentStyle={{ 
                background: isDark ? '#1f2937' : '#fff',
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
                borderRadius: '6px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                color: isDark ? '#f9fafb' : '#111827'
              }}
            />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
              fill={colors[type].main}
            >
              <LabelList
                position="right"
                fill={isDark ? "#f9fafb" : "#111827"}
                stroke="none"
                dataKey="name"
                fontSize={12}
              />
              <LabelList
                position="center"
                fill="#ffffff"
                stroke="none"
                dataKey="value"
                fontSize={14}
                fontWeight="bold"
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderConversionChart = (type: FunnelType) => {
    const data = funnelData[type].stages;
    const colors = getColorsByType(type);
    
    return (
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#444" : "#e5e7eb"} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tick={{fontSize: 12}} 
              stroke={isDark ? "#ccc" : "#374151"}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={60} 
              tick={{fontSize: 12}} 
              stroke={isDark ? "#ccc" : "#374151"}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Eficiência']}
              contentStyle={{ 
                background: isDark ? '#1f2937' : '#fff',
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
                borderRadius: '6px', 
                color: isDark ? '#f9fafb' : '#111827'
              }}
            />
            <Bar dataKey="efficiency" fill={colors[type].efficiency} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="efficiency" position="right" formatter={(value) => `${value}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderLeakageChart = (type: FunnelType) => {
    const data = funnelData[type].stages;
    const colors = getColorsByType(type);

    return (
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#444" : "#e5e7eb"} />
            <XAxis 
              type="number" 
              domain={[0, 50]} 
              tick={{fontSize: 12}} 
              stroke={isDark ? "#ccc" : "#374151"}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={60} 
              tick={{fontSize: 12}} 
              stroke={isDark ? "#ccc" : "#374151"}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Fugas']}
              contentStyle={{ 
                background: isDark ? '#1f2937' : '#fff',
                border: isDark ? '1px solid #374151' : '1px solid #e5e7eb', 
                borderRadius: '6px', 
                color: isDark ? '#f9fafb' : '#111827'
              }}
            />
            <Bar dataKey="leakage" fill={colors[type].leakage} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="leakage" position="right" formatter={(value) => `${value}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderFunnelSummary = (type: FunnelType) => {
    const data = funnelData[type];
    const totalLeakage = 100 - data.conversionRate;
    const averageEfficiency = Math.round(
      data.stages.reduce((sum, stage) => sum + stage.efficiency, 0) / data.stages.length
    );
    
    return (
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-3 w-3" />
            <span>Total</span>
          </div>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {data.totalItems}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 shadow-sm">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-3 w-3" />
            <span>Eficiência</span>
          </div>
          <p className="text-lg font-bold text-green-700 dark:text-green-300">
            {averageEfficiency}%
          </p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 shadow-sm">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <TrendingDown className="h-3 w-3" />
            <span>Fugas</span>
          </div>
          <p className="text-lg font-bold text-red-700 dark:text-red-300">
            {totalLeakage}%
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="shadow-md border border-border/60 bg-card/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Funis Integrados</CardTitle>
            <Badge variant="outline" className="flex items-center text-xs animate-pulse-subtle">
              <Activity className="mr-1 h-3 w-3" /> 
              Ao Vivo
            </Badge>
          </div>
          <Badge variant="outline" className="flex items-center bg-primary/10 hover:bg-primary/20 transition-all">
            <TrendingUp className="mr-1 h-3 w-3" /> 
            Conv: {funnelData[activeTab].conversionRate}%
          </Badge>
        </div>
        <CardDescription>
          Visão detalhada dos funis de vendas, clientes e produção
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
            <TabsContent key={type} value={type} className="space-y-4 animation-fade-in">
              <div className="grid grid-cols-1 gap-4 transition-all duration-300">
                {/* Visual Funnel Chart */}
                <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    {getFunnelIcon(type as FunnelType)}
                    <h3 className="text-sm font-medium">Funil Visual</h3>
                  </div>
                  {renderFunnelChart(type as FunnelType)}
                </Card>
                
                {/* Three funnel metrics cards in a responsive grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Conversion Funnel */}
                  <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <h3 className="text-sm font-medium">Conversão por Etapa</h3>
                    </div>
                    {renderConversionChart(type as FunnelType)}
                  </Card>
                  
                  {/* Leakage Funnel */}
                  <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <h3 className="text-sm font-medium">Fugas por Etapa</h3>
                    </div>
                    {renderLeakageChart(type as FunnelType)}
                  </Card>
                  
                  {/* Overall Summary */}
                  <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <h3 className="text-sm font-medium">Resumo Geral</h3>
                    </div>
                    {/* Summary content with small visualizations */}
                    <div className="flex flex-col h-full justify-between">
                      <div className="space-y-4 flex-grow">
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span>Etapas</span>
                            <span className="font-semibold">{funnelData[type as FunnelType].stages.length}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Entrada</span>
                            <span className="font-semibold">{funnelData[type as FunnelType].stages[0].value}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Saída</span>
                            <span className="font-semibold">{funnelData[type as FunnelType].stages[funnelData[type as FunnelType].stages.length - 1].value}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Eficiência Média</span>
                            <span className="font-semibold">{Math.round(funnelData[type as FunnelType].stages.reduce((sum, stage) => sum + stage.efficiency, 0) / funnelData[type as FunnelType].stages.length)}%</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Taxa de Conversão</span>
                            <span className="font-semibold">{funnelData[type as FunnelType].conversionRate}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {renderFunnelSummary(type as FunnelType)}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              {funnelData[type as FunnelType].stages.some(stage => stage.leakage > 30) && (
                <div className="flex items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm animate-pulse-subtle">
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
