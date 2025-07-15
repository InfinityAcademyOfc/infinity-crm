import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, PaperclipIcon, Smile, Mic, Plus, MessageSquare } from "lucide-react";
import { logError } from "@/utils/logger";

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
  const [contacts, setContacts] = useState<{number: string, name?: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load contacts and conversation numbers
  useEffect(() => {
    const loadNumbersAndContacts = async () => {
      try {
        // Fetch messages to get unique numbers
        const { data: messageData, error: messageError } = await supabase
          .from("whatsapp_messages")
          .select("number")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false });
          
        if (messageError) throw messageError;
        
        // Extract unique numbers from messages
        const uniqueNumbers = Array.from(new Set((messageData || []).map(m => m.number)));
        
        // Fetch contacts to get names
        const { data: contactData, error: contactError } = await supabase
          .from("contacts")
          .select("name, phone")
          .eq("session_id", sessionId);
          
        if (contactError) throw contactError;
        
        // Create a map of phone number to contact name
        const contactMap = new Map();
        (contactData || []).forEach(contact => {
          contactMap.set(contact.phone, contact.name);
        });
        
        // Create contacts list with names where available
        const contactsList = uniqueNumbers.map(number => ({
          number,
          name: contactMap.get(number)
        }));
        
        setContacts(contactsList);
        
        // Select the first number if available
        if (uniqueNumbers.length > 0 && !selectedNumber) {
          setSelectedNumber(uniqueNumbers[0]);
        }
      } catch (error) {
        logError("Error loading contacts and numbers:", error, { component: "WhatsAppConversations" });
      }
    };
    
    if (sessionId) {
      loadNumbersAndContacts();
    }
  }, [sessionId, selectedNumber]);

  // Load messages for selected number
  useEffect(() => {
    if (!selectedNumber || !sessionId) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("whatsapp_messages")
          .select("*")
          .eq("session_id", sessionId)
          .eq("number", selectedNumber)
          .order("created_at");

        if (error) throw error;
        setMessages(data || []);
        
        // Scroll to bottom
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 100);
      } catch (error) {
        logError("Error loading messages:", error, { component: "WhatsAppConversations" });
      }
    };

    loadMessages();

    // Listener for realtime updates
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "whatsapp_messages",
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.number === selectedNumber) {
            setMessages((prev) => [...prev, newMsg]);
            // Scroll to bottom
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }, 100);
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

    try {
      // Send message to backend API
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
    } catch (error) {
      logError("Error sending message:", error, { component: "WhatsAppConversations" });
    }
  };

  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      <div className="w-80 border-r bg-muted/30">
        <div className="p-3 border-b">
          <Input
            placeholder="Pesquisar ou começar nova conversa"
            className="bg-muted"
          />
        </div>
        <ScrollArea className="h-[calc(100%-56px)]">
          <div className="space-y-1 p-2">
            {contacts.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                Nenhuma conversa encontrada
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.number}
                  onClick={() => setSelectedNumber(contact.number)}
                  className={`cursor-pointer p-3 rounded-md ${
                    selectedNumber === contact.number
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {contact.name?.charAt(0).toUpperCase() || contact.number.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium truncate">
                          {contact.name || contact.number}
                        </h4>
                        <span className="text-xs text-muted-foreground">10:30</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Última mensagem...
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedNumber ? (
          <>
            <div className="p-3 border-b bg-muted/30 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {contacts.find(c => c.number === selectedNumber)?.name?.charAt(0).toUpperCase() || selectedNumber.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium">
                  {contacts.find(c => c.number === selectedNumber)?.name || selectedNumber}
                </h4>
                <p className="text-xs text-muted-foreground">online</p>
              </div>
            </div>
            
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Nenhuma mensagem. Envie uma mensagem para começar.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.from_me
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <div className="text-xs text-right mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t bg-muted/10 flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Smile size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <PaperclipIcon size={20} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite uma mensagem"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim()}
                variant="ghost"
                size="icon"
                className={input.trim() ? "text-primary" : ""}
              >
                {input.trim() ? <Send size={20} /> : <Mic size={20} />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-muted-foreground">
            <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare size={64} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
            <p className="text-center max-w-md mb-4">
              Selecione uma conversa ou inicie uma nova para enviar mensagens.
            </p>
            <Button variant="outline">
              <Plus size={16} className="mr-2" /> Nova Conversa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppConversations;
