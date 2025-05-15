
import { useContext } from 'react';
import { WhatsAppContextType } from './types';
import { WhatsAppContext } from './WhatsAppContext';

export const useWhatsApp = (): WhatsAppContextType => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error("useWhatsApp must be used within a WhatsAppProvider");
  }
  return context;
};
