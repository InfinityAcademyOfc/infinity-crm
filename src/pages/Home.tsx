
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const Home = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Home" 
        description="Página inicial do sistema"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Bem-vindo ao sistema!</p>
      </div>
    </div>
  );
};

export default Home;
