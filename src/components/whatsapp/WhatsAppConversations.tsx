// src/components/whatsapp/WhatsAppConversations.tsx

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizonal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  id: string;
  fromMe: boolean;
  message: string;
  createdAt: string;
}

interface Chat {
  number: string;
  name: string;
  messages: Message[];
}

interface Props {
  sessionId: string;
}

const WhatsAppConversations = ({ sessionId }: Props) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId) return;
    fetchChats();
  }, [sessionId]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_URL}/messages/${sessionId}/chats`);
      const data = await res.json();
      setChats(data);
    } catch (err) {
      toast({
        title: "Erro ao buscar conversas",
        description: "Não foi possível carregar as conversas.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;
    try {
      await fetch(`${API_URL}/messages/${sessionId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: selectedChat.number,
          message: message.trim(),
        }),
      });
      setMessage("");
      fetchChats(); // Atualiza após enviar
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full">
      {/* Lista de contatos */}
      <div className="w-[260px] border-r bg-muted overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.number}
            className={`p-4 cursor-pointer hover:bg-accent ${
              selectedChat?.number === chat.number ? "bg-accent" : ""
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            <p className="font-medium">{chat.name || chat.number}</p>
            <p className="text-xs text-muted-foreground truncate">
              {chat.messages.at(-1)?.message || "Sem mensagens"}
            </p>
          </div>
        ))}
      </div>

      {/* Tela de conversa */}
      <div className="flex flex-col flex-1">
        {selectedChat ? (
          <>
            <div className="px-4 py-2 border-b bg-background shadow">
              <p className="font-medium">{selectedChat.name || selectedChat.number}</p>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-2">
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.fromMe
                      ? "bg-green-100 dark:bg-green-900/30 self-end text-right ml-auto"
                      : "bg-muted text-left"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                </div>
              ))}
            </ScrollArea>

            <div className="flex items-center p-4 border-t gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>
                <SendHorizonal size={18} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Selecione uma conversa
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppConversations;
