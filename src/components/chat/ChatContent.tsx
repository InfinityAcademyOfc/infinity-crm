
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "agent";
}

interface ChatContentProps {
  initialMessages?: ChatMessage[];
  className?: string;
}

const ChatContent = ({ initialMessages, className }: ChatContentProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages || [
      { id: 1, text: "Olá! Como posso ajudar você hoje?", sender: "agent" },
    ]
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Safe scrolling implementation
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("Error scrolling to bottom:", error);
      }
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Clean up any pending timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "user" as const,
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage("");
    
    // Store timeout ID for cleanup
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      const responses = [
        "Entendi! Posso ajudar com isso.",
        "Obrigado pela mensagem. Vou verificar e retornar em breve.",
        "Perfeito! Alguma outra informação que você precisa?",
        "Vou encaminhar isso para o departamento responsável.",
        "Compreendo sua solicitação. Vamos resolver isso rapidamente.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: randomResponse,
          sender: "agent",
        },
      ]);
      
      timeoutRef.current = null;
    }, 1000);
  };

  return (
    <div className={`flex-1 flex flex-col ${className || ""}`}>
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "agent" && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>CS</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4 border-t flex">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="mr-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatContent;
