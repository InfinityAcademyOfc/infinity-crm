
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RealSalesFunnelBoard } from '@/components/sales-funnel/RealSalesFunnelBoard';
import { FunnelHeader } from '@/components/sales-funnel/FunnelHeader';
import { FunnelAnalytics } from '@/components/sales-funnel/FunnelAnalytics';
import { useRealSalesFunnel } from '@/hooks/useRealSalesFunnel';

const SalesFunnel = () => {
  const { stages, leads, loading } = useRealSalesFunnel();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddNewLead = () => {
    // Implementation for adding new lead
  };

  const handleFiltersApplied = () => {
    setFilterMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando funil de vendas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Funil de Vendas" 
        description="Gerencie seus leads através do pipeline de vendas"
      />
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="board" className="w-full">
          <TabsList>
            <TabsTrigger value="board">Quadro Kanban</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="board" className="space-y-4">
            <FunnelHeader
              showAnalytics={showAnalytics}
              setShowAnalytics={setShowAnalytics}
              filterMenuOpen={filterMenuOpen}
              setFilterMenuOpen={setFilterMenuOpen}
              onAddNewLead={handleAddNewLead}
              onFiltersApplied={handleFiltersApplied}
            />
            
            <RealSalesFunnelBoard
              stages={stages}
              leads={leads}
              searchQuery={searchQuery}
            />
          </TabsContent>
          
          <TabsContent value="analytics">
            <FunnelAnalytics leads={leads} stages={stages} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SalesFunnel;
