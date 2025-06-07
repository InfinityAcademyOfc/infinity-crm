
import { WhatsAppMessage } from "@/types/whatsapp";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface ChatMessagesProps {
  messages: WhatsAppMessage[];
  loading?: boolean;
}

const ChatMessages = ({ messages, loading }: ChatMessagesProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Nenhuma mensagem. Envie uma mensagem para começar.
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "max-w-[70%] p-3 rounded-lg",
            msg.from_me
              ? "ml-auto bg-primary text-primary-foreground"
              : "bg-muted"
          )}
        >
          <p>{msg.message}</p>
          <div className="text-xs text-right mt-1 opacity-70">
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
