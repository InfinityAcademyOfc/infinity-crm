
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Zap, 
  Calendar, 
  BarChart2, 
  Users,
  Settings,
  ArrowUpDown,
  MoveHorizontal
} from "lucide-react";
import AutoResponderManager from "../autoresponders/AutoResponderManager";
import ChatbotVisualEditor from "../chatbot/ChatbotVisualEditor";

const AutomationsManager = () => {
  const [activeTab, setActiveTab] = useState("autoresponder");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Automações do WhatsApp</h2>
        <p className="text-muted-foreground">
          Configure automações inteligentes para otimizar seu atendimento no WhatsApp
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`cursor-pointer hover:border-primary transition-colors ${activeTab === 'autoresponder' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('autoresponder')}>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare size={18} /> Autoresponder
            </CardTitle>
            <CardDescription>
              Configure respostas automáticas por palavras-chave
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className={`cursor-pointer hover:border-primary transition-colors ${activeTab === 'chatbot' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('chatbot')}>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap size={18} /> Chatbot Visual
            </CardTitle>
            <CardDescription>
              Crie fluxos de conversação arrastando e soltando
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className={`cursor-pointer hover:border-primary transition-colors ${activeTab === 'schedule' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('schedule')}>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar size={18} /> Agendamentos
            </CardTitle>
            <CardDescription>
              Agende mensagens e campanhas em massa
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div>
        {activeTab === 'autoresponder' && (
          <AutoResponderManager />
        )}
        
        {activeTab === 'chatbot' && (
          <ChatbotVisualEditor />
        )}
        
        {activeTab === 'schedule' && (
          <div className="p-6 border rounded-lg flex flex-col items-center justify-center">
            <Calendar size={64} className="text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Gerenciador de Agendamentos</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Configure agendamentos de mensagens individuais ou em massa para seus contatos
              e listas do WhatsApp.
            </p>
            <Button>Acessar Agendamentos</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationsManager;
