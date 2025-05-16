
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageSquare } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

// Import our newly created component files
import ContactsList from "./conversation/ContactsList";
import ChatMessages from "./conversation/ChatMessages";
import MessageInput from "./conversation/MessageInput";
import ContactHeader from "./conversation/ContactHeader";
import EmptyConversation from "./conversation/EmptyConversation";

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

  // Auto-scroll to the end when new messages arrive
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
      {/* Left sidebar with contacts */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-3 border-b">
          <div className="flex items-center gap-2 bg-muted rounded-md p-2">
            <Search className="text-muted-foreground" size={16} />
            <Input
              placeholder="Pesquisar conversa..."
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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

      {/* Right side conversation area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedContact ? (
          <>
            {/* Contact header */}
            <ContactHeader contact={selectedContact} />
            
            {/* Messages area */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <ChatMessages 
                messages={messages} 
                loading={loadingMessages} 
              />
            </ScrollArea>
            
            {/* Message input */}
            <MessageInput 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={handleSendMessage}
            />
          </>
        ) : (
          <EmptyConversation />
        )}
      </div>
    </div>
  );
};

export default WhatsAppConversations;
