
import React from 'react';
import { WhatsAppProvider } from '@/contexts/WhatsAppContext';
import ProductionWorkspace from '@/components/production/ProductionWorkspace';

export default function ProductionManagement() {
  return (
    <WhatsAppProvider>
      <div className="h-full">
        <ProductionWorkspace />
      </div>
    </WhatsAppProvider>
  );
}
