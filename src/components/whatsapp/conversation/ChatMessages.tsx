
import React from "react";
import { WhatsAppMessage } from "@/types/whatsapp";
import { cn } from "@/lib/utils";
import { Check, CheckCheck, Clock } from "lucide-react";

interface ChatMessagesProps {
  messages: WhatsAppMessage[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, WhatsAppMessage[]>);

  const getMessageStatus = (message: WhatsAppMessage) => {
    if (!message.from_me) return null;
    
    // Mock status based on message age
    const messageAge = Date.now() - new Date(message.created_at).getTime();
    if (messageAge < 5000) {
      return "sending";
    } else if (messageAge < 30000) {
      return "sent";
    } else if (messageAge < 120000) {
      return "delivered";
    } else {
      return "read";
    }
  };

  const renderMessageStatus = (status: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex justify-center my-4">
            <div className="bg-background border rounded-full px-3 py-1 text-xs text-muted-foreground">
              {formatDate(dayMessages[0].created_at)}
            </div>
          </div>
          
          {/* Messages for this date */}
          <div className="space-y-2">
            {dayMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.from_me ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 relative",
                    message.from_me
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {/* Message content */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </div>
                  
                  {/* Message time and status */}
                  <div className={cn(
                    "flex items-center gap-1 mt-1 text-xs",
                    message.from_me 
                      ? "text-primary-foreground/70 justify-end" 
                      : "text-muted-foreground justify-end"
                  )}>
                    <span>{formatTime(message.created_at)}</span>
                    {renderMessageStatus(getMessageStatus(message))}
                  </div>
                  
                  {/* Message tail */}
                  <div
                    className={cn(
                      "absolute top-0 w-0 h-0",
                      message.from_me
                        ? "right-0 translate-x-2 border-l-8 border-l-primary border-t-8 border-t-transparent"
                        : "left-0 -translate-x-2 border-r-8 border-r-muted border-t-8 border-t-transparent"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            Nenhuma mensagem ainda. Inicie uma conversa!
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
