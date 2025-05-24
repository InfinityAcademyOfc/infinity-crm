
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  MessageSquare, 
  Bell, 
  Clock, 
  Bot, 
  Loader2,
  Save,
  RotateCcw
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useWhatsApp } from "@/contexts/WhatsAppContext";

const SettingsPanel = () => {
  const { currentSession, connectionStatus, isApiAvailable } = useWhatsApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // General settings
  const [autoConnect, setAutoConnect] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [syncContacts, setSyncContacts] = useState(true);
  
  // Auto-responder settings
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! Obrigado por entrar em contato. Como posso ajudar você hoje?"
  );
  const [firstMsgDailyEnabled, setFirstMsgDailyEnabled] = useState(true);
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  
  // Notification settings
  const [newMessageNotifications, setNewMessageNotifications] = useState(true);
  const [connectionNotifications, setConnectionNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Chatbot settings
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
  const [aiResponseEnabled, setAiResponseEnabled] = useState(false);
  const [keywordTriggers, setKeywordTriggers] = useState("oi, olá, help, ajuda");

  const isConnected = connectionStatus === "connected";

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const settings = {
        general: {
          autoConnect,
          saveHistory,
          syncContacts
        },
        autoresponder: {
          enabled: autoReplyEnabled,
          welcomeMessage,
          firstMsgDailyEnabled,
          delaySeconds,
          businessHoursOnly,
          startTime,
          endTime
        },
        notifications: {
          newMessageNotifications,
          connectionNotifications,
          emailNotifications,
          soundEnabled
        },
        chatbot: {
          enabled: chatbotEnabled,
          aiResponseEnabled,
          keywordTriggers: keywordTriggers.split(",").map(k => k.trim())
        }
      };
      
      console.log("Saving WhatsApp settings:", settings);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setAutoConnect(true);
    setSaveHistory(true);
    setSyncContacts(true);
    setAutoReplyEnabled(false);
    setWelcomeMessage("Olá! Obrigado por entrar em contato. Como posso ajudar você hoje?");
    setFirstMsgDailyEnabled(true);
    setDelaySeconds(2);
    setBusinessHoursOnly(false);
    setStartTime("09:00");
    setEndTime("18:00");
    setNewMessageNotifications(true);
    setConnectionNotifications(true);
    setEmailNotifications(false);
    setSoundEnabled(true);
    setChatbotEnabled(false);
    setAiResponseEnabled(false);
    setKeywordTriggers("oi, olá, help, ajuda");
    
    toast.success("Configurações restauradas para o padrão");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações do WhatsApp</h2>
          <p className="text-muted-foreground">
            Configure o comportamento e automações do seu WhatsApp
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
          {!isApiAvailable && (
            <Badge variant="outline">Modo Simulado</Badge>
          )}
        </div>
      </div>

      {!currentSession && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                Conecte uma sessão do WhatsApp para acessar todas as configurações.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="autoresponder" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Auto-resposta</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Chatbot</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Conectar automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Tenta reconectar automaticamente quando a sessão cai
                  </p>
                </div>
                <Switch 
                  checked={autoConnect} 
                  onCheckedChange={setAutoConnect}
                  disabled={!currentSession}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Salvar histórico de conversas</Label>
                  <p className="text-sm text-muted-foreground">
                    Armazena mensagens no banco de dados
                  </p>
                </div>
                <Switch 
                  checked={saveHistory} 
                  onCheckedChange={setSaveHistory}
                  disabled={!currentSession}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sincronizar contatos</Label>
                  <p className="text-sm text-muted-foreground">
                    Mantém a lista de contatos atualizada
                  </p>
                </div>
                <Switch 
                  checked={syncContacts} 
                  onCheckedChange={setSyncContacts}
                  disabled={!currentSession}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autoresponder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resposta Automática</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar resposta automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Responde automaticamente a mensagens recebidas
                  </p>
                </div>
                <Switch 
                  checked={autoReplyEnabled} 
                  onCheckedChange={setAutoReplyEnabled}
                  disabled={!currentSession}
                />
              </div>
              
              {autoReplyEnabled && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="welcome-message">Mensagem de boas-vindas</Label>
                    <Textarea
                      id="welcome-message"
                      value={welcomeMessage}
                      onChange={(e) => setWelcomeMessage(e.target.value)}
                      placeholder="Digite sua mensagem de boas-vindas..."
                      rows={3}
                      disabled={!currentSession}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="delay">Delay da resposta (segundos)</Label>
                      <Input
                        id="delay"
                        type="number"
                        min="0"
                        max="30"
                        value={delaySeconds}
                        onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 0)}
                        disabled={!currentSession}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Apenas primeira mensagem do dia</Label>
                      <p className="text-sm text-muted-foreground">
                        Responde só na primeira mensagem de cada contato por dia
                      </p>
                    </div>
                    <Switch 
                      checked={firstMsgDailyEnabled} 
                      onCheckedChange={setFirstMsgDailyEnabled}
                      disabled={!currentSession}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Apenas horário comercial</Label>
                      <p className="text-sm text-muted-foreground">
                        Responde automaticamente apenas no horário definido
                      </p>
                    </div>
                    <Switch 
                      checked={businessHoursOnly} 
                      onCheckedChange={setBusinessHoursOnly}
                      disabled={!currentSession}
                    />
                  </div>
                  
                  {businessHoursOnly && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Horário de início</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          disabled={!currentSession}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">Horário de fim</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          disabled={!currentSession}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Novas mensagens</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando novas mensagens chegarem
                  </p>
                </div>
                <Switch 
                  checked={newMessageNotifications} 
                  onCheckedChange={setNewMessageNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Status de conexão</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações quando conectar ou desconectar
                  </p>
                </div>
                <Switch 
                  checked={connectionNotifications} 
                  onCheckedChange={setConnectionNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Som das notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Reproduzir som quando receber notificações
                  </p>
                </div>
                <Switch 
                  checked={soundEnabled} 
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por e-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba resumos importantes por e-mail
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot e IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ativar chatbot</Label>
                  <p className="text-sm text-muted-foreground">
                    Responde automaticamente usando regras pré-definidas
                  </p>
                </div>
                <Switch 
                  checked={chatbotEnabled} 
                  onCheckedChange={setChatbotEnabled}
                  disabled={!currentSession}
                />
              </div>
              
              {chatbotEnabled && (
                <>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Respostas com IA</Label>
                      <p className="text-sm text-muted-foreground">
                        Usar inteligência artificial para gerar respostas
                      </p>
                    </div>
                    <Switch 
                      checked={aiResponseEnabled} 
                      onCheckedChange={setAiResponseEnabled}
                      disabled={!currentSession}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave de ativação</Label>
                    <Input
                      id="keywords"
                      value={keywordTriggers}
                      onChange={(e) => setKeywordTriggers(e.target.value)}
                      placeholder="oi, olá, help, ajuda"
                      disabled={!currentSession}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separe as palavras-chave por vírgula
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex justify-between">
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={saving}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar Padrão
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={saving || !currentSession}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
