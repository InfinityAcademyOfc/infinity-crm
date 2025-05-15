
import { createContext } from 'react';
import { WhatsAppContextType } from './types';

// Create context with null initial value instead of undefined
export const WhatsAppContext = createContext<WhatsAppContextType | null>(null);
WhatsAppContext.displayName = "WhatsAppContext";
