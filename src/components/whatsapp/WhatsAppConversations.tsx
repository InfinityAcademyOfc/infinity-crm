
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, WifiOff, ChevronLeft, Send, Image } from "lucide-react";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import ChatMessages from "./conversation/ChatMessages";
import ContactsSidebar from "./conversation/ContactsSidebar";
import ContactHeader from "./conversation/ContactHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function WhatsAppConversations() {
  const {
    selectedContact,
    setSelectedContact,
    messages,
    loadingMessages,
    sessionId,
    fetchMessages,
    sendMessage,
    connectionStatus,
    isApiAvailable
  } = useWhatsApp();

  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAttaching, setIsAttaching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isConnected = connectionStatus === "connected" && !!sessionId;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && selectedContact) {
      setShowSidebar(false);
    } else if (!isMobile) {
      setShowSidebar(true);
    }
  }, [selectedContact, isMobile]);

  useEffect(() => {
    if (selectedContact && sessionId && isConnected) {
      fetchMessages(selectedContact.phone, sessionId);
    }
  }, [selectedContact, sessionId, fetchMessages, isConnected]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() && selectedContact && sessionId && (isConnected || !isApiAvailable)) {
      await sendMessage(selectedContact.phone, message);
      setMessage("");
    }
  };

  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToContacts = () => {
    if (isMobile) {
      setShowSidebar(true);
      setSelectedContact(null);
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedContact && sessionId) {
      setIsAttaching(true);
      
      // Implementar upload de imagem (mockado por enquanto)
      setTimeout(() => {
        setIsAttaching(false);
        // Mock de envio com URL de imagem
        sendMessage(selectedContact.phone, `[Imagem: ${file.name}]`);
      }, 1000);
      
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Filtrar mensagens relevantes para o contato atual
  const filteredMessages = selectedContact
    ? messages.filter(
        (msg) => {
          const msgNumber = msg.number;
          const contactNumber = selectedContact.phone;
          const fromNumber = msg.from || ''; 
          const toNumber = msg.to || '';     
          
          return msgNumber === contactNumber || 
                 fromNumber === contactNumber || 
                 toNumber === contactNumber;
        }
      )
    : [];
      
  if (!isConnected && isApiAvailable) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">WhatsApp não conectado</h3>
          <p className="text-sm text-muted-foreground">
            Você precisa conectar o WhatsApp para visualizar e enviar mensagens. 
            Escaneie o código QR para conectar.
          </p>
        </div>
      </div>
    );
  }
  
  if (!isApiAvailable) {
    return (
      <div className="h-full flex flex-col">
        <Alert className="m-4 border-amber-200 bg-amber-50">
          <WifiOff className="h-4 w-4 text-amber-500" />
          <AlertDescription>
            API do WhatsApp não disponível. Funcionando em modo simulado.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-1 overflow-hidden">
          {(showSidebar || !isMobile) && (
            <div className={cn("border-r", isMobile ? "w-full" : "w-1/3")}>
              <ContactsSidebar onSelectContact={handleSelectContact} />
            </div>
          )}
          
          {(!showSidebar || !isMobile) && (
            <div className={cn("flex flex-col", isMobile ? "w-full" : "w-2/3")}>
              {selectedContact ? (
                <>
                  <ContactHeader 
                    contact={selectedContact} 
                    onBack={isMobile ? handleBackToContacts : undefined}
                  />
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loadingMessages ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                      </div>
                    ) : filteredMessages.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Nenhuma mensagem nesta conversa ainda.
                      </p>
                    ) : (
                      <ChatMessages messages={filteredMessages} />
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-3 border-t flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={handleAttachFile}
                      disabled={isAttaching}
                    >
                      {isAttaching ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Image className="h-5 w-5" />
                      )}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelected}
                    />
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder={`Mensagem para ${selectedContact.name || selectedContact.phone}`}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSend}
                      className="shrink-0"
                      size="icon"
                      type="submit" 
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Selecione um contato</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {(showSidebar || !isMobile) && (
        <div 
          className={cn(
            "border-r transition-all duration-300", 
            isMobile ? "w-full" : "w-1/3"
          )}
        >
          <ContactsSidebar onSelectContact={handleSelectContact} />
        </div>
      )}
      
      {(!showSidebar || !isMobile) && (
        <div 
          className={cn(
            "flex flex-col transition-all duration-300", 
            isMobile ? "w-full" : "w-2/3"
          )}
        >
          {selectedContact ? (
            <>
              <ContactHeader 
                contact={selectedContact}
                onBack={isMobile ? handleBackToContacts : undefined}
              />
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Nenhuma mensagem nesta conversa ainda.
                  </p>
                ) : (
                  <ChatMessages messages={filteredMessages} />
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={handleAttachFile}
                  disabled={isAttaching}
                >
                  {isAttaching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Image className="h-5 w-5" />
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelected}
                />
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={`Mensagem para ${selectedContact.name || selectedContact.phone}`}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSend}
                  className="shrink-0"
                  size="icon"
                  type="submit" 
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2">
                <ChevronLeft className="h-6 w-6 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  {isMobile ? "Volte para selecionar um contato" : "Selecione um contato"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
