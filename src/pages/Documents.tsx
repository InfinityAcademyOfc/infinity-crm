
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const Documents = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Documentos" 
        description="Gerencie seus documentos e arquivos"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Sistema de documentos em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default Documents;
