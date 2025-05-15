
import React, { useEffect, useRef } from "react";
import { Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import * as ResizablePrimitive from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatContent from "./ChatContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FloatingPanelProps {
  isOpen: boolean;
  chatWidth: number;
  chatHeight: number;
  activeTab: string;
  onTabChange: (value: string) => void;
  onResize: () => void;
  onClose: () => void;
  onFullScreen: () => void;
}

const FloatingPanel = ({
  isOpen,
  chatWidth,
  chatHeight,
  activeTab,
  onTabChange,
  onResize,
  onClose,
  onFullScreen,
}: FloatingPanelProps) => {
  const isMobile = useIsMobile();
  // Using ResizablePrimitive.ImperativePanelGroupHandle which is the correct type
  const panelRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);
  
  if (!isOpen) return null;

  const sizeMultiplier = isMobile ? 0.7 : 1;
  const adjustedWidth = Math.round(chatWidth * sizeMultiplier);
  const adjustedHeight = Math.round(chatHeight * sizeMultiplier);

  // This handles clicking outside to close on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Since we can't directly check if the panel contains the event target anymore,
      // we need a different approach for detecting outside clicks
      if (isMobile) {
        // Create a selector targeting the panel by its classname or other attributes
        const panelElement = document.querySelector('.floating-panel-container');
        if (panelElement && !panelElement.contains(event.target as Node)) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, onClose]);

  return (
    <ResizablePanelGroup
      ref={panelRef}
      className="mb-4 bg-background border rounded-lg shadow-lg overflow-hidden floating-panel-container"
      style={{ width: adjustedWidth, height: adjustedHeight }}
      onResize={onResize}
      direction="vertical"
    >
      <ResizablePanel defaultSize={100} minSize={30}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>
                  <span className="text-primary">AC</span>
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium">Comunicação</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onFullScreen}
                className="h-7 w-7"
                aria-label="Expandir"
              >
                <Maximize2 size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-7 w-7"
                aria-label="Fechar"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="px-2 pt-2 justify-start border-b">
              <TabsTrigger value="chat" className="text-xs px-2 h-8">Interno</TabsTrigger>
              <TabsTrigger value="groups" className="text-xs px-2 h-8">Grupos</TabsTrigger>
              <TabsTrigger value="contacts" className="text-xs px-2 h-8">Contatos</TabsTrigger>
              <TabsTrigger value="whatsapp" className="text-xs px-2 h-8">WhatsApp</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="flex-1">
              <TabsContent value="chat" className="h-full m-0">
                <ChatContent />
              </TabsContent>
              
              <TabsContent value="groups" className="h-full m-0">
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Grupos de conversas com membros da empresa e clientes
                </div>
              </TabsContent>
              
              <TabsContent value="contacts" className="h-full m-0">
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Contatos externos (clientes, fornecedores e parceiros)
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FloatingPanel;
