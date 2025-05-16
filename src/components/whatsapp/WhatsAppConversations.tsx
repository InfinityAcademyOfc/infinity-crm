import React, { useState } from "react";
import { useWhatsAppMessages } from "@/hooks/useWhatsAppMessages";
import { useWhatsAppSession } from "@/contexts/WhatsAppSessionContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WhatsAppConversations = () => {
  const { sessionId } = useWhatsAppSession();
  const { messages, contacts, isLoading, sendMessage } = useWhatsAppMessages();
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  if (!sessionId) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Nenhuma sessão conectada. Conecte um número do WhatsApp para iniciar.
      </div>
    );
  }

  const handleSend = async () => {
    if (selectedContact && message.trim() !== "") {
      await sendMessage(selectedContact, message);
      setMessage("");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <Card className="col-span-1 overflow-y-auto max-h-[80vh]">
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Contatos</h2>
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li
                key={contact.id}
                className={`p-2 rounded cursor-pointer ${
                  selectedContact === contact.phone
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedContact(contact.phone)}
              >
                {contact.name || contact.phone}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-3 flex flex-col h-[80vh]">
        <CardContent className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-muted-foreground">Carregando mensagens...</div>
          ) : selectedContact ? (
            messages
              .filter(
                (msg) =>
                  msg.to === selectedContact || msg.from === selectedContact
              )
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 my-1 rounded max-w-[70%] ${
                    msg.from === "me"
                      ? "bg-primary text-white self-end ml-auto"
                      : "bg-muted text-foreground self-start mr-auto"
                  }`}
                >
                  {msg.body}
                </div>
              ))
          ) : (
            <div className="text-muted-foreground">
              Selecione um contato para visualizar mensagens.
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedContact}
          />
          <Button onClick={handleSend} disabled={!selectedContact || !message}>
            Enviar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WhatsAppConversations;
