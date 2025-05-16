
import { useState } from "react";
import { WhatsAppContact } from "@/types/whatsapp";
import { cn } from "@/lib/utils";

interface ContactsListProps {
  contacts: WhatsAppContact[];
  selectedContact: WhatsAppContact | null;
  onSelectContact: (contact: WhatsAppContact) => void;
  searchQuery: string;
}

const ContactsList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact,
  searchQuery
}: ContactsListProps) => {
  // Filter contacts based on search query
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
                  {/* Placeholder for last message preview */}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContactsList;
