
import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import WhatsAppChat from "./WhatsAppChat";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFullScreen(false);
    }
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
    setIsOpen(false);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const handleWhatsAppClick = () => {
    toast({
      title: "WhatsApp",
      description: "Redirecionando para o módulo WhatsApp",
    });
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 bg-primary">
          <h2 className="text-primary-foreground font-medium">WhatsApp</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeFullScreen}
            className="text-primary-foreground hover:bg-primary/90"
          >
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <WhatsAppChat />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-2 p-3 animate-fade-in w-48">
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={openFullScreen}
            >
              <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
              Abrir WhatsApp
            </Button>
            <Link to="/whatsapp">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleWhatsAppClick}
              >
                <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
                WhatsApp Integração
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <Button
        size="icon"
        onClick={toggleOpen}
        className={`rounded-full h-12 w-12 shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>
    </div>
  );
};

export default FloatingWhatsApp;
