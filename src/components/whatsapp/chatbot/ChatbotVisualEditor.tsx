
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LayoutGrid, MessageSquare, Clock, FileText, SendHorizontal } from "lucide-react";
import { DndProvider } from "@/components/ui/dnd-provider";
import FlowBuilder from "./FlowBuilder";
import ConditionEditor from "./ConditionEditor";

interface ChatbotVisualEditorProps {
  sessionId: string;
}

const ChatbotVisualEditor = ({ sessionId }: ChatbotVisualEditorProps) => {
  const [flowItems, setFlowItems] = useState<string[]>([
    "welcome-message",
    "keyword-response",
    "delay-action",
    "media-response",
    "conditional"
  ]);

  const handleDragEnd = (activeId: string, overId: string) => {
    // Reorder logic would go here
    setFlowItems((items) => {
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      
      const newItems = [...items];
      newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, activeId);
      
      return newItems;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fluxos de Chatbot</CardTitle>
        <CardDescription>Configure automações e fluxos de conversação para atendimento automático</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="flowbuilder">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="flowbuilder" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Construtor de Fluxo
            </TabsTrigger>
            <TabsTrigger value="conditions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Editor de Condições
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Configuração de Delay
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="flowbuilder" className="mt-0">
            <DndProvider items={flowItems} onDragEnd={handleDragEnd}>
              <FlowBuilder items={flowItems} sessionId={sessionId} />
            </DndProvider>
          </TabsContent>
          
          <TabsContent value="conditions" className="mt-0">
            <ConditionEditor sessionId={sessionId} />
          </TabsContent>
          
          <TabsContent value="timing" className="mt-0">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Configuração de Delay</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Configure o tempo de espera entre mensagens para simular uma digitação humana.
                </p>
                
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="min-delay" className="text-sm font-medium">
                        Delay mínimo (segundos)
                      </label>
                      <input
                        id="min-delay"
                        type="number"
                        min="1"
                        max="60"
                        defaultValue="3"
                        className="rounded-md border p-2"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="max-delay" className="text-sm font-medium">
                        Delay máximo (segundos)
                      </label>
                      <input
                        id="max-delay"
                        type="number"
                        min="1"
                        max="120"
                        defaultValue="10"
                        className="rounded-md border p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChatbotVisualEditor;
