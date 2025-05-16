
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  PaperclipIcon, 
  Smile, 
  Mic, 
  Plus, 
  Search, 
  MessageSquare,
  Loader 
} from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

// Componente separado para o input de mensagem
const MessageInput = ({ value, onChange, onSend }: MessageInputProps) => {
  return (
    <div className="p-3 border-t bg-muted/10 flex items-center gap-2">
      <Button variant="ghost" size="icon">
        <Smile size={20} />
      </Button>
      <Button variant="ghost" size="icon">
        <PaperclipIcon size={20} />
      </Button>
      <Input
        value={value}
        onChange={onChange}
        placeholder="Digite uma mensagem"
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim()}
        variant="ghost"
        size="icon"
        className={value.trim() ? "text-primary" : ""}
      >
        {value.trim() ? <Send size={20} /> : <Mic size={20} />}
      </Button>
    </div>
  );
};

// Componente para a lista de contatos
const ContactsList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact,
  searchQuery
}: {
  contacts: ReturnType<typeof useWhatsApp>["contacts"];
  selectedContact: ReturnType<typeof useWhatsApp>["selectedContact"];
  onSelectContact: (contact: ReturnType<typeof useWhatsApp>["contacts"][0]) => void;
  searchQuery: string;
}) => {
  // Filtrar contatos baseado na pesquisa
  const filteredContacts = contacts.filter(contact => {
    const contactName = contact.name || contact.number || contact.phone || '';
    const query = searchQuery.toLowerCase();
    return contactName.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-1 p-2">
      {filteredContacts.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa iniciada"}
        </div>
      ) : (
        filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={cn(
              "cursor-pointer p-3 rounded-md",
              selectedContact?.id === contact.id
                ? "bg-primary/10 border-l-4 border-primary"
                : "hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {(contact.name || contact.number || contact.phone || "")?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium truncate">
                    {contact.name || contact.number || contact.phone}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {/* Último preview de mensagem (implementar no futuro) */}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Componente de mensagens
const ChatMessages = ({ 
  messages, 
  loading
}: { 
  messages: ReturnType<typeof useWhatsApp>["messages"];
  loading: boolean;
}) => {
  return (
    <>
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          Nenhuma mensagem. Envie uma mensagem para começar.
        </div>
      ) : (
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
      )}
    </>
  );
};

// Componente principal de conversas
const WhatsAppConversations = ({ sessionId }: { sessionId: string }) => {
  const { 
    contacts, 
    messages, 
    selectedContact, 
    setSelectedContact,
    loadingMessages,
    sendMessage
  } = useWhatsApp();
  
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para o final quando novas mensagens chegarem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-full border rounded-lg overflow-hidden">
      {/* Painel lateral de contatos */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-3 border-b">
          <Input
            placeholder="Pesquisar conversa..."
            className="bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search className="text-muted-foreground" size={16} />}
          />
        </div>
        <ScrollArea className="h-[calc(100%-56px)]">
          <ContactsList 
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={setSelectedContact}
            searchQuery={searchQuery}
          />
        </ScrollArea>
      </div>

      {/* Área de conversas */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedContact ? (
          <>
            {/* Cabeçalho do contato */}
            <div className="p-3 border-b bg-muted/30 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {(selectedContact.name || selectedContact.number || selectedContact.phone || "")?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium">
                  {selectedContact.name || selectedContact.number || selectedContact.phone}
                </h4>
                <p className="text-xs text-muted-foreground">online</p>
              </div>
            </div>
            
            {/* Área de mensagens */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <ChatMessages 
                messages={messages} 
                loading={loadingMessages} 
              />
            </ScrollArea>
            
            {/* Input de mensagem */}
            <MessageInput 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={handleSendMessage}
            />
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
