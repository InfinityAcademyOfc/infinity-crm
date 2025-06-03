
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const Goals = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Metas" 
        description="Defina e acompanhe suas metas"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Sistema de metas em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default Goals;
