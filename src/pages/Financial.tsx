
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const Financial = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Financeiro" 
        description="Controle financeiro e faturamento"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Sistema financeiro em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default Financial;
