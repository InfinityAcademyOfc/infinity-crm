
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ChatContent from "./ChatContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ChatFullScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ChatFullScreenDialog = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: ChatFullScreenDialogProps) => {
  const originalOverflowStyle = useRef<string>('');

  // Ensure body scroll is disabled when dialog is open with proper cleanup
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow style before modifying
      originalOverflowStyle.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      // Restore the original overflow style
      document.body.style.overflow = originalOverflowStyle.current;
    }
    
    // Always restore original overflow on unmount
    return () => {
      document.body.style.overflow = originalOverflowStyle.current;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[90vw] h-[80vh] p-0">
        <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>
                <span className="text-primary">AC</span>
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">Comunicação</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full h-full">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="chat" className="h-[calc(100%-50px)] flex flex-col">
            <ChatContent />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChatFullScreenDialog;
