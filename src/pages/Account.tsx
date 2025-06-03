
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const Account = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Conta" 
        description="Configurações da sua conta"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Configurações de conta em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default Account;
