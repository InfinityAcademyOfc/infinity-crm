import React, { Suspense, useState, startTransition } from 'react';
import { Filter, Users, CheckCircle2, Activity, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; 
import { useFunnelData, getColorsByType, type FunnelType } from '@/hooks/useFunnelData';
import FunnelChart from './funnel/FunnelChart';
import ConversionChart from './funnel/ConversionChart';
import LeakageChart from './funnel/LeakageChart';
import FunnelSummary from './funnel/FunnelSummary';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { ChartSkeleton } from './DashboardSkeletons';

const IntegratedFunnel = () => {
  const {
    activeTab,
    setActiveTab,
    funnelData,
    isDark,
    isLoading
  } = useFunnelData();
  
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    // Use startTransition to avoid Suspense errors during state updates
    startTransition(() => {
      setActiveTab(value as FunnelType);
    });
  };

  // Fallback if data is still loading
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Verification check for data
  if (!funnelData || !funnelData[activeTab]) {
    return (
      <Card className="shadow-md border border-border/60 bg-card/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Funis Integrados</CardTitle>
          <CardDescription>Carregando dados dos funis...</CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <div className="text-muted-foreground">Carregando informações...</div>
        </CardContent>
      </Card>
    );
  }
  
  const getFunnelIcon = (type: FunnelType) => {
    const colors = {
      sales: "text-blue-500",
      ltv: "text-purple-500",
      production: "text-cyan-500"
    };
    switch (type) {
      case 'sales':
        return <Filter className={`h-4 w-4 ${colors.sales}`} />;
      case 'ltv':
        return <Users className={`h-4 w-4 ${colors.ltv}`} />;
      case 'production':
        return <CheckCircle2 className={`h-4 w-4 ${colors.production}`} />;
    }
  };

  // Verification for conversion rate
  const conversionRate = funnelData[activeTab]?.conversionRate || 0;
  
  // Transform funnel data to pie chart format
  const getPieChartData = (type: FunnelType) => {
    if (!funnelData[type] || !funnelData[type].stages) return [];
    
    return funnelData[type].stages.map(stage => ({
      name: stage.name,
      value: stage.value
    }));
  };
  
  const COLORS = ['#4361ee', '#7209b7', '#9d4edd', '#3a0ca3', '#4cc9f0'];
  
  const handleExportFunnel = () => {
    try {
      const funnelType = activeTab;
      const currentData = funnelData[funnelType];
      
      // Prepare data for export
      let exportData: any = {
        funnelType,
        stages: currentData.stages,
        conversionRate: currentData.conversionRate,
        date: new Date().toISOString()
      };
      
      // Add extra data based on funnel type
      if (funnelType === 'sales') {
        exportData.salesData = {
          leads: currentData.stages.reduce((acc, stage) => acc + stage.value, 0),
          salesReps: ['Carlos Silva', 'Ana Oliveira', 'João Santos'],
          efficiency: `${currentData.conversionRate}%`
        };
      } else if (funnelType === 'ltv') {
        exportData.ltvData = {
          clients: currentData.stages.reduce((acc, stage) => acc + stage.value, 0),
          products: ['Marketing Digital', 'Consultoria', 'Desenvolvimento'],
          averageValue: 'R$ 5.200,00'
        };
      } else if (funnelType === 'production') {
        exportData.productionData = {
          tasks: currentData.stages.reduce((acc, stage) => acc + stage.value, 0),
          collaborators: ['Pedro Costa', 'Juliana Lima', 'Roberto Almeida'],
          efficiency: `${currentData.conversionRate}%`
        };
      }
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a blob and download it
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `funil-${funnelType}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: `Exportação concluída`,
        description: `Os dados do funil de ${funnelType === 'sales' ? 'Vendas' : funnelType === 'ltv' ? 'LTV' : 'Produção'} foram exportados com sucesso.`,
      });
    } catch (error) {
      console.error("Error exporting funnel data:", error);
      toast({
        title: `Erro na exportação`,
        description: `Ocorreu um erro ao exportar os dados.`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="shadow-md border border-border/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg bg-transparent">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Funis Integrados</CardTitle>
            <Badge variant="outline" className="flex items-center text-xs animate-pulse-subtle">
              <Activity className="mr-1 h-3 w-3" /> 
              Ao Vivo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center bg-primary/10 hover:bg-primary/20 transition-all">
              <TrendingUp className="mr-1 h-3 w-3" /> 
              Conv: {conversionRate}%
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 flex items-center gap-1"
              onClick={handleExportFunnel}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          </div>
        </div>
        <CardDescription>
          Visão detalhada dos funis de vendas, clientes e produção
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 bg-transparent">
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="space-y-4"
        >
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
          
          {/* Wrap content in Suspense to handle async loading */}
          <Suspense fallback={<ChartSkeleton />}>
            {Object.keys(funnelData).map(type => {
              if (!funnelData[type as FunnelType] || !funnelData[type as FunnelType].stages) {
                return null;
              }
              
              return (
                <TabsContent key={type} value={type} className="space-y-4 animation-fade-in">
                  <div className="grid grid-cols-1 gap-4 transition-all duration-300">
                    <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getFunnelIcon(type as FunnelType)}
                              <h3 className="text-sm font-medium">Visão do Funil</h3>
                            </div>
                          </div>
                          <FunnelChart data={funnelData[type as FunnelType].stages} isDark={isDark} />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <h3 className="text-sm font-medium">Conversão do Funil</h3>
                            </div>
                          </div>
                          <div className="h-56 md:h-64 flex items-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie 
                                  data={getPieChartData(type as FunnelType)} 
                                  cx="50%" 
                                  cy="50%" 
                                  innerRadius={60} 
                                  outerRadius={80} 
                                  paddingAngle={5} 
                                  dataKey="value"
                                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  {getPieChartData(type as FunnelType).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={value => [`${value} itens`, "Quantidade"]}
                                  contentStyle={{
                                    background: isDark ? '#1f2937' : '#fff',
                                    border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                  }} 
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </Card>
                      
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <h3 className="text-sm font-medium">Conversão por Etapa</h3>
                        </div>
                        <ConversionChart data={funnelData[type as FunnelType].stages} isDark={isDark} color={getColorsByType(type as FunnelType, isDark)[type as FunnelType]?.efficiency || '#22c55e'} />
                      </Card>
                      
                      <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-red-500" />
                          <h3 className="text-sm font-medium">Fugas por Etapa</h3>
                        </div>
                        <LeakageChart data={funnelData[type as FunnelType].stages} isDark={isDark} color={getColorsByType(type as FunnelType, isDark)[type as FunnelType]?.leakage || '#ef4444'} />
                      </Card>
                      
                      <Card className="p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <h3 className="text-sm font-medium">Resumo Geral</h3>
                        </div>
                        <div className="flex flex-col h-full justify-between my-0 mx-0 px-0 py-[45px]">
                          <div className="space-y-4 flex-grow">
                            <div className="flex flex-col space-y-1">
                              <div className="flex justify-between items-center text-sm">
                                <span>Etapas</span>
                                <span className="font-semibold">{funnelData[type as FunnelType].stages.length}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span>Entrada</span>
                                <span className="font-semibold">
                                  {funnelData[type as FunnelType].stages[0]?.value || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span>Saída</span>
                                <span className="font-semibold">
                                  {funnelData[type as FunnelType].stages[funnelData[type as FunnelType].stages.length - 1]?.value || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <FunnelSummary type={type as FunnelType} data={funnelData[type as FunnelType]} />
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  
                  {funnelData[type as FunnelType].stages.some(stage => (stage.leakage || 0) > 30) && (
                    <div className="flex items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm animate-pulse-subtle">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <span>Atenção: Algumas etapas possuem fugas acima de 30%</span>
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Suspense>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegratedFunnel;
