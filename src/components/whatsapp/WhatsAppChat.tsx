
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import WhatsAppConversations from "@/components/whatsapp/WhatsAppConversations";

interface WhatsAppChatProps {
  sessionId?: string;
  className?: string;
}

const WhatsAppChat = ({ sessionId = "teste", className }: WhatsAppChatProps) => {
  const [currentSessionId] = useState(sessionId);

  return (
    <div className={`whatsapp-chat ${className || ""}`}>
      <WhatsAppConversations sessionId={currentSessionId} />
    </div>
  );
};

export default WhatsAppChat;
