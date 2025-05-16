
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, PaperclipIcon, Smile, Mic } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

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

export default MessageInput;
