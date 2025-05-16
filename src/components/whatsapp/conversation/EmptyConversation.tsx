
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";

const EmptyConversation = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-muted-foreground">
      <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center mb-4">
        <MessageSquare size={64} className="text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
      <p className="text-center max-w-md mb-4">
        Selecione uma conversa ou inicie uma nova para enviar mensagens.
      </p>
      <Button variant="outline">
        <Plus size={16} className="mr-2" /> Nova Conversa
      </Button>
    </div>
  );
};

export default EmptyConversation;
