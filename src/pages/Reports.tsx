
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import SalesReport from '@/components/reports/SalesReport';
import LeadsReport from '@/components/reports/LeadsReport';
import FinancialReport from '@/components/reports/FinancialReport';
import PerformanceReport from '@/components/reports/PerformanceReport';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Implementar exportação
    console.log('Exporting report...');
  };

  const reportTabs = [
    { id: 'sales', label: 'Vendas', icon: DollarSign },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'financial', label: 'Financeiro', icon: TrendingUp },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  const quickStats = [
    {
      title: 'Receita Total',
      value: 'R$ 147.500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Leads Convertidos',
      value: '142',
      change: '+8.1%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Taxa de Conversão',
      value: '23.4%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Vendas este Mês',
      value: '38',
      change: '-5.2%',
      trend: 'down',
      icon: Calendar
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader 
          title="Relatórios e Analytics" 
          description="Análises detalhadas do desempenho do seu negócio"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs">
                  <Badge 
                    variant={stat.trend === 'up' ? 'default' : 'destructive'} 
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <span className="ml-2 text-muted-foreground">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Reports */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <TabsContent value="sales">
          <SalesReport />
        </TabsContent>
        
        <TabsContent value="leads">
          <LeadsReport />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialReport />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
