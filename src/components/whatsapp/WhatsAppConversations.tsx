// src/components/whatsapp/WhatsAppConversations.tsx

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";

interface Message {
  id: string;
  session_id: string;
  number: string;
  message: string;
  from_me: boolean;
  created_at: string;
}

interface WhatsAppConversationsProps {
  sessionId: string;
}

const WhatsAppConversations = ({ sessionId }: WhatsAppConversationsProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [input, setInput] = useState("");

  // Busca números únicos dessa sessão
  useEffect(() => {
    const loadNumbers = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("number")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });

      if (!error && data.length) {
        const uniqueNumbers = Array.from(new Set(data.map((m) => m.number)));
        setSelectedNumber(uniqueNumbers[0]);
      }
    };

    loadNumbers();
  }, [sessionId]);

  // Carrega mensagens
  useEffect(() => {
    if (!selectedNumber) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .eq("number", selectedNumber)
        .order("created_at");

      setMessages(data || []);
    };

    loadMessages();

    // Real-time listener
    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.number === selectedNumber) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, selectedNumber]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedNumber) return;

    await fetch(`${import.meta.env.VITE_API_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        number: selectedNumber,
        message: input.trim()
      })
    });

    setInput("");
  };

  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      <div className="w-64 border-r p-2 bg-muted">
        <h4 className="font-medium mb-2">Contatos</h4>
        <div className="space-y-1 overflow-y-auto max-h-[500px]">
          {[...new Set(messages.map((m) => m.number))].map((number) => (
            <div
              key={number}
              onClick={() => setSelectedNumber(number)}
              className={`cursor-pointer p-2 rounded text-sm ${
                selectedNumber === number ? "bg-primary text-white" : "hover:bg-muted-foreground/10"
              }`}
            >
              {number}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <ScrollArea className="flex-1 p-4">
          {selectedNumber ? (
            messages
              .filter((m) => m.number === selectedNumber)
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] mb-2 p-2 rounded-lg ${
                    msg.from_me ? "ml-auto bg-green-500 text-white" : "bg-gray-100"
                  }`}
                >
                  {msg.message}
                </div>
              ))
          ) : (
            <p className="text-center text-muted-foreground mt-10">Nenhum número selecionado</p>
          )}
        </ScrollArea>

        {selectedNumber && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex p-4 border-t gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem"
            />
            <Button type="submit" disabled={!input.trim()}>
              <SendHorizonal size={18} />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WhatsAppConversations;
