
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const InternalCommunication = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Comunicação Interna" 
        description="Chat e comunicação da equipe"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Sistema de comunicação em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default InternalCommunication;
