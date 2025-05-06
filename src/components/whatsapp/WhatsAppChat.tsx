
import { useState, useEffect } from "react";
import WhatsAppConversations from "@/components/whatsapp/WhatsAppConversations";
import { useQRCode } from "@/hooks/useQRCode";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WhatsAppChatProps {
  sessionId?: string;
  className?: string;
  onOpenQRCode?: () => void;
}

const WhatsAppChat = ({ 
  sessionId = "teste", 
  className,
  onOpenQRCode 
}: WhatsAppChatProps) => {
  const [currentSessionId] = useState(sessionId);
  const { status } = useQRCode(currentSessionId);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("WhatsApp chat status:", status);
  }, [status]);

  const handleConnectClick = () => {
    if (onOpenQRCode) {
      onOpenQRCode();
    } else {
      toast({
        title: "Conectar WhatsApp",
        description: "Navegue para a página de integração do WhatsApp para conectar.",
      });
    }
  };

  return (
    <div className={`whatsapp-chat ${className || ""}`}>
      {status !== "connected" ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg p-6">
          <p className="text-muted-foreground mb-4 text-center">
            Aguardando conexão com o WhatsApp para exibir as conversas...
          </p>
          <Button 
            variant="outline" 
            onClick={handleConnectClick}
            className="flex items-center gap-2"
          >
            <QrCode size={16} />
            Conectar WhatsApp
          </Button>
        </div>
      ) : (
        <WhatsAppConversations sessionId={currentSessionId} />
      )}
    </div>
  );
};

export default WhatsAppChat;
