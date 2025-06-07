
import React, { useState, useEffect } from "react";
import { ChevronDown, MessageCircle, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingChat from "@/components/chat/FloatingChat";
import VideoCall from "@/components/chat/VideoCall";
import { useFloatingAction } from "@/hooks/use-floating-action";
import { cn } from "@/lib/utils";

const UnifiedChatButton = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    activePanel,
    setActivePanel
  } = useFloatingAction();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePanel = (panel: string) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

  const buttonSize = isMobile ? "h-10 w-10 sm:h-12 sm:w-12" : "h-12 w-12";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Action buttons that appear when expanded */}
      {isExpanded && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "rounded-full shadow-lg transition-all scale-90 hover:scale-100",
              activePanel === "chat" ? "bg-primary text-primary-foreground" : "",
              buttonSize
            )}
            onClick={() => togglePanel("chat")}
          >
            <MessageCircle className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
            <span className="sr-only">Chat</span>
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "rounded-full shadow-lg transition-all scale-90 hover:scale-100",
              activePanel === "call" ? "bg-primary text-primary-foreground" : "",
              buttonSize
            )}
            onClick={() => togglePanel("call")}
          >
            <Phone className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
            <span className="sr-only">Chamadas</span>
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "rounded-full shadow-lg transition-all scale-90 hover:scale-100",
              activePanel === "contacts" ? "bg-primary text-primary-foreground" : "",
              buttonSize
            )}
            onClick={() => togglePanel("contacts")}
          >
            <Users className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
            <span className="sr-only">Contatos</span>
          </Button>
        </>
      )}
      
      {/* Main toggle button */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          "rounded-full shadow-lg",
          buttonSize
        )}
        onClick={toggleExpanded}
      >
        {isExpanded ? <ChevronDown className={isMobile ? "h-5 w-5" : "h-6 w-6"} /> : <MessageCircle className={isMobile ? "h-5 w-5" : "h-6 w-6"} />}
      </Button>
      
      {/* Panels */}
      <FloatingChat isOpen={activePanel === "chat"} onClose={() => setActivePanel(null)} />
      
      <VideoCall isOpen={activePanel === "call"} onClose={() => setActivePanel(null)} />

      {activePanel === "contacts" && (
        <div className="absolute bottom-20 right-0 w-96 max-w-[calc(100vw-2rem)] bg-background rounded-lg shadow-lg border border-border p-4 max-h-[600px] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Contatos</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActivePanel(null)}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {/* Contact list */}
            {["João Silva", "Maria Oliveira", "Carlos Santos", "Ana Lima", "Roberto Ferreira"].map((name, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-muted-foreground">Online agora</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedChatButton;
