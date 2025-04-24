
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      key={message.id}
      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] p-2 rounded-lg ${
        message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        <p className="text-sm">{message.text}</p>
        <p className="text-xs opacity-70 text-right mt-1">{message.time}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
