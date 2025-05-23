
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { supabase } from "@/integrations/supabase/client";
import ChatbotResponseForm from './ChatbotResponseForm';
import ChatbotResponseList from './ChatbotResponseList';

export interface ChatbotManagerProps {
  sessionId?: string;
}

export interface ChatbotResponse {
  id: string;
  trigger_type: string;
  trigger_value?: string;
  response_content?: string;
  response_type: string;
  media_url?: string;
  delay_seconds: number;
  active: boolean;
  created_at: string;
}

const ChatbotManager = ({ sessionId }: ChatbotManagerProps) => {
  const { toast } = useToast();
  const { currentSession, connectionStatus } = useWhatsApp();
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('responses');
  const [showForm, setShowForm] = useState(false);

  const isConnected = connectionStatus === "connected" && !!sessionId;

  // Carregar respostas automáticas existentes
  useEffect(() => {
    if (!sessionId) return;

    const loadResponses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('chatbots')
          .select('*')
          .eq('user_id', sessionId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResponses(data || []);
      } catch (err) {
        console.error("Erro ao carregar respostas:", err);
        toast({
          title: "Erro ao carregar respostas",
          description: "Não foi possível carregar as respostas automáticas",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [sessionId, toast]);

  const handleSaveResponse = async (responseData: Partial<ChatbotResponse>) => {
    if (!sessionId) return;

    try {
      const newResponse = {
        ...responseData,
        user_id: sessionId,
        response_type: responseData.response_type || 'text',
        active: true,
        delay_seconds: responseData.delay_seconds || 0,
      };

      const { data, error } = await supabase
        .from('chatbots')
        .insert([newResponse])
        .select();

      if (error) throw error;

      setResponses(prev => [...(data || []), ...prev]);
      setShowForm(false);
      
      toast({
        title: "Resposta automática criada",
        description: "A resposta automática foi criada com sucesso",
      });
    } catch (err) {
      console.error("Erro ao salvar resposta:", err);
      toast({
        title: "Erro ao salvar resposta",
        description: "Não foi possível criar a resposta automática",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResponse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResponses(prev => prev.filter(response => response.id !== id));
      
      toast({
        title: "Resposta removida",
        description: "A resposta automática foi removida com sucesso",
      });
    } catch (err) {
      console.error("Erro ao remover resposta:", err);
      toast({
        title: "Erro ao remover resposta",
        description: "Não foi possível remover a resposta automática",
        variant: "destructive"
      });
    }
  };

  const handleToggleResponseActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('chatbots')
        .update({ active: !active })
        .eq('id', id);

      if (error) throw error;

      setResponses(prev => 
        prev.map(response => 
          response.id === id ? { ...response, active: !active } : response
        )
      );
      
      toast({
        title: active ? "Resposta desativada" : "Resposta ativada",
        description: `A resposta automática foi ${active ? "desativada" : "ativada"} com sucesso`,
      });
    } catch (err) {
      console.error("Erro ao atualizar resposta:", err);
      toast({
        title: "Erro ao atualizar resposta",
        description: "Não foi possível atualizar a resposta automática",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chatbot WhatsApp
          </CardTitle>
          {isConnected && !showForm && (
            <Button 
              size="sm" 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1"
            >
              <Plus size={16} /> Nova Resposta
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center p-6">
            <Bot size={48} className="text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Conecte uma sessão WhatsApp para ativar o chatbot.
            </p>
          </div>
        ) : showForm ? (
          <ChatbotResponseForm 
            onSave={handleSaveResponse}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="responses" className="flex items-center gap-1">
                <MessageSquare size={16} />
                Respostas Automáticas
              </TabsTrigger>
              <TabsTrigger value="flows" className="flex items-center gap-1">
                <Bot size={16} />
                Fluxos de Conversa
              </TabsTrigger>
            </TabsList>
            <TabsContent value="responses">
              <ChatbotResponseList 
                responses={responses}
                isLoading={isLoading}
                onDelete={handleDeleteResponse}
                onToggleActive={handleToggleResponseActive}
              />
            </TabsContent>
            <TabsContent value="flows">
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  Fluxos de conversação serão implementados em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatbotManager;
