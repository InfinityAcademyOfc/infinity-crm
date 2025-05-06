
import { useState, useEffect } from "react";
import WhatsAppConversations from "@/components/whatsapp/WhatsAppConversations";
import { useQRCode } from "@/hooks/useQRCode";

interface WhatsAppChatProps {
  sessionId?: string;
  className?: string;
}

const WhatsAppChat = ({ sessionId = "teste", className }: WhatsAppChatProps) => {
  const [currentSessionId] = useState(sessionId);
  const { status } = useQRCode(currentSessionId);
  
  useEffect(() => {
    console.log("WhatsApp chat status:", status);
  }, [status]);

  if (status !== "connected") {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">
          Aguardando conexão com o WhatsApp para exibir as conversas...
        </p>
      </div>
    );
  }

  return (
    <div className={`whatsapp-chat ${className || ""}`}>
      <WhatsAppConversations sessionId={currentSessionId} />
    </div>
  );
};

export default WhatsAppChat;
