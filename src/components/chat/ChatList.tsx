
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ContactType } from "./types";

interface ChatListProps {
  contacts: ContactType[];
  onSelectChat: (contact: ContactType) => void;
  selectedId?: string;
}

const ChatList = ({ contacts, onSelectChat, selectedId }: ChatListProps) => {
  return (
    <>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-md ${
            selectedId === contact.id ? 'bg-muted' : ''
          }`}
          onClick={() => onSelectChat(contact)}
        >
          <Avatar className="h-10 w-10">
            {contact.avatar ? (
              <AvatarImage src={contact.avatar} />
            ) : (
              <AvatarFallback>
                {contact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <span className="font-medium text-sm">{contact.name}</span>
              {contact.unread > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {contact.unread}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatList;
