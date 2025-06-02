
import React from 'react';
import SalesFunnelBoard from '@/components/sales-funnel/SalesFunnelBoard';

const SalesFunnel = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Funil de Vendas</h1>
          <p className="text-muted-foreground">Gerencie seu pipeline de vendas</p>
        </div>
      </div>

      <SalesFunnelBoard />
    </div>
  );
};

export default SalesFunnel;
