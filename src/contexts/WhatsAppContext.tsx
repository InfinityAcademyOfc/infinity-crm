
import React from "react";
import { WhatsAppProvider as ModularWhatsAppProvider } from "./whatsapp/WhatsAppProvider";
import { useWhatsApp as useModularWhatsApp } from "./whatsapp/useWhatsApp";
import type { 
  WhatsAppContextType,
  WhatsAppSession,
  WhatsAppContact,
  WhatsAppMessage
} from "./whatsapp/types";

// Re-export the provider and hook
export const WhatsAppProvider = ModularWhatsAppProvider;
export const useWhatsApp = useModularWhatsApp;

// Re-export the types
export type {
  WhatsAppContextType,
  WhatsAppSession,
  WhatsAppContact,
  WhatsAppMessage
};
