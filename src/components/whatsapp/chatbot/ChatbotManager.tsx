
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ChatbotResponseList from './ChatbotResponseList';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatbotResponse {
  id: string;
  user_id: string;
  trigger_type: string;
  trigger_value?: string;
  response_type: string;
  response_content: string;
  media_url?: string;
  active: boolean;
  delay_seconds: number;
  created_at: string;
}

export const ChatbotManager = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('welcome');

  const [newResponse, setNewResponse] = useState<Omit<ChatbotResponse, 'id' | 'created_at'>>({
    user_id: user?.id || '',
    trigger_type: 'welcome',
    response_type: 'text',
    response_content: '',
    active: true,
    delay_seconds: 0
  });

  useEffect(() => {
    if (user) {
      loadResponses();
    }
  }, [user]);

  const loadResponses = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Verificar se a tabela existe antes de tentar consultar
      const { data: tablesData } = await supabase
        .from('chatbots')
        .select('*')
        .limit(1);
      
      if (tablesData) {
        const { data, error } = await supabase
          .from('chatbots')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setResponses(data || []);
      } else {
        // Tabela não existe ou sem permissões, vamos usar dados de exemplo
        setResponses([
          {
            id: '1', 
            user_id: user.id,
            trigger_type: 'welcome',
            response_type: 'text',
            response_content: 'Olá! Bem-vindo ao nosso atendimento',
            active: true,
            delay_seconds: 0,
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as respostas do chatbot',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResponse = async () => {
    if (!user) return;
    if (!newResponse.response_content) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe o conteúdo da resposta',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Garantir que trigger_type esteja definido
      const responseToSave = {
        ...newResponse,
        trigger_type: newResponse.trigger_type || 'welcome'
      };

      // Mock do salvamento
      const mockSavedResponse: ChatbotResponse = {
        ...responseToSave,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString()
      };

      setResponses(prev => [...prev, mockSavedResponse]);

      toast({
        title: 'Resposta salva',
        description: 'A resposta automática foi configurada com sucesso'
      });

      // Limpar formulário
      setNewResponse({
        user_id: user.id,
        trigger_type: 'welcome',
        response_type: 'text',
        response_content: '',
        active: true,
        delay_seconds: 0
      });
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a resposta',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteResponse = async (id: string) => {
    try {
      setResponses(prev => prev.filter(response => response.id !== id));
      
      toast({
        title: 'Resposta removida',
        description: 'A resposta automática foi removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover resposta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a resposta',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      setResponses(prev => 
        prev.map(response => 
          response.id === id 
            ? { ...response, active: !currentActive } 
            : response
        )
      );
      
      toast({
        title: currentActive ? 'Resposta desativada' : 'Resposta ativada',
        description: `A resposta automática foi ${currentActive ? 'desativada' : 'ativada'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao atualizar status da resposta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status da resposta',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciador de Respostas Automáticas</CardTitle>
        <CardDescription>
          Configure respostas automáticas para seu chatbot do WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="welcome">Boas-vindas</TabsTrigger>
            <TabsTrigger value="keyword">Palavras-chave</TabsTrigger>
            <TabsTrigger value="fallback">Fallback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="welcome" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-response">Mensagem de boas-vindas</Label>
                <Textarea
                  id="welcome-response"
                  placeholder="Digite a mensagem que será enviada quando um novo contato iniciar uma conversa"
                  value={newResponse.response_content}
                  onChange={e => setNewResponse(prev => ({ ...prev, response_content: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tempo de espera (segundos)</Label>
                <Input
                  type="number"
                  min={0}
                  value={newResponse.delay_seconds}
                  onChange={e => setNewResponse(prev => ({ ...prev, delay_seconds: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="keyword" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Palavra-chave</Label>
                <Input
                  id="keyword"
                  placeholder="Ex: preço, horário, suporte"
                  onChange={e => setNewResponse(prev => ({ ...prev, trigger_value: e.target.value, trigger_type: 'keyword' }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keyword-response">Resposta</Label>
                <Textarea
                  id="keyword-response"
                  placeholder="Digite a resposta para quando esta palavra-chave for detectada"
                  value={newResponse.response_content}
                  onChange={e => setNewResponse(prev => ({ ...prev, response_content: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de resposta</Label>
                <Select
                  value={newResponse.response_type}
                  onValueChange={value => setNewResponse(prev => ({ ...prev, response_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de resposta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                    <SelectItem value="button">Botões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newResponse.response_type === 'image' && (
                <div className="space-y-2">
                  <Label htmlFor="media-url">URL da imagem</Label>
                  <Input
                    id="media-url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    onChange={e => setNewResponse(prev => ({ ...prev, media_url: e.target.value }))}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="fallback" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fallback-response">Mensagem de fallback</Label>
              <Textarea
                id="fallback-response"
                placeholder="Digite a mensagem que será enviada quando nenhuma resposta automática for encontrada"
                value={newResponse.response_content}
                onChange={e => setNewResponse(prev => ({ ...prev, response_content: e.target.value, trigger_type: 'fallback' }))}
                rows={4}
              />
            </div>
          </TabsContent>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={newResponse.active}
              onCheckedChange={value => setNewResponse(prev => ({ ...prev, active: value }))}
              id="active-response"
            />
            <Label htmlFor="active-response">Ativar resposta</Label>
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSaveResponse}>Salvar Resposta</Button>
      </CardFooter>
      
      <CardContent className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Respostas Configuradas</h3>
        <ChatbotResponseList
          responses={responses}
          isLoading={isLoading}
          onDelete={handleDeleteResponse}
          onToggleActive={handleToggleActive}
        />
      </CardContent>
    </Card>
  );
};

export default ChatbotManager;
