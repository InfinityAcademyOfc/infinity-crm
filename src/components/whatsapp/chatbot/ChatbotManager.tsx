
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bot, AlertCircle } from "lucide-react";

export interface ChatbotManagerProps {
  sessionId?: string;
}

const ChatbotManager = ({ sessionId }: ChatbotManagerProps) => {
  const isConnected = !!sessionId;

  return (
    <Card className="h-full">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        {isConnected ? (
          <>
            <Bot size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chatbot WhatsApp</h3>
            <p className="text-center text-muted-foreground mb-4">
              Configure respostas automáticas e fluxos de conversação para seu WhatsApp.
            </p>
          </>
        ) : (
          <>
            <AlertCircle size={48} className="text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">WhatsApp não conectado</h3>
            <p className="text-center text-amber-600">
              Conecte uma sessão WhatsApp para ativar o chatbot.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatbotManager;
