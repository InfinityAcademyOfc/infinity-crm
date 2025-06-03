
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquare, Bell, Clock, Settings, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const WhatsAppSettings = () => {
  const { user } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! Obrigado por entrar em contato. Como posso ajudar você hoje?"
  );
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [firstMsgDailyEnabled, setFirstMsgDailyEnabled] = useState(true);
  const [delaySeconds, setDelaySeconds] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState("");
  
  // Load config from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        
        // Get the active WhatsApp session for this user
        const { data: sessionData, error: sessionError } = await supabase
          .from("whatsapp_sessions")
          .select("id, session_id")
          .eq("profile_id", user.id)
          .eq("is_connected", true)
          .single();
          
        if (sessionError && sessionError.code !== 'PGRST116') {
          throw sessionError;
        }
        
        if (sessionData) {
          setSessionId(sessionData.session_id);
          
          // Get config for this session
          const { data: configData, error: configError } = await supabase
            .from("config")
            .select("*")
            .eq("session_id", sessionData.id)
            .single();
            
          if (configError && configError.code !== 'PGRST116') {
            throw configError;
          }
          
          if (configData) {
            setWelcomeMessage(configData.welcome_message || welcomeMessage);
            setAutoReplyEnabled(!!configData.welcome_message);
            setFirstMsgDailyEnabled(configData.first_msg_daily !== false);
            setDelaySeconds(configData.delay_seconds || 2);
          }
        } else {
          toast.warning("Nenhuma sessão WhatsApp ativa encontrada");
        }
      } catch (error) {
        console.error("Error fetching WhatsApp config:", error);
        toast.error("Não foi possível carregar as configurações do WhatsApp");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, [user, welcomeMessage]);

  const handleSaveConfig = async () => {
    if (!sessionId) {
      toast.error("Nenhuma sessão WhatsApp ativa encontrada");
      return;
    }
    
    try {
      setSaving(true);
      
      // Check if config exists
      const { data, error: checkError } = await supabase
        .from("config")
        .select("id")
        .eq("session_id", sessionId);
        
      if (checkError) throw checkError;
      
      if (data && data.length > 0) {
        // Update existing config
        const { error } = await supabase
          .from("config")
          .update({
            welcome_message: autoReplyEnabled ? welcomeMessage : null,
            first_msg_daily: firstMsgDailyEnabled,
            delay_seconds: delaySeconds
          })
          .eq("session_id", sessionId);
          
        if (error) throw error;
      } else {
        // Create new config
        const { error } = await supabase
          .from("config")
          .insert({
            session_id: sessionId,
            welcome_message: autoReplyEnabled ? welcomeMessage : null,
            first_msg_daily: firstMsgDailyEnabled,
            delay_seconds: delaySeconds,
            user_id: user?.id
          });
          
        if (error) throw error;
      }
      
      toast.success("Configurações do WhatsApp salvas com sucesso");
    } catch (error) {
      console.error("Error saving WhatsApp config:", error);
      toast.error("Não foi possível salvar as configurações");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!sessionId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Configurações do WhatsApp</CardTitle>
          <CardDescription>Configure as opções de comportamento do seu WhatsApp</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <MessageSquare size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma sessão ativa</h3>
          <p className="text-center text-muted-foreground mb-4">
            Você precisa conectar uma sessão do WhatsApp antes de configurar.
          </p>
          <Button>Ir para Integração WhatsApp</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações do WhatsApp</CardTitle>
        <CardDescription>
          Configure as opções de comportamento do seu WhatsApp
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="autoresponder" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Autoresponder
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="session-name">ID da sessão</Label>
                <Input
                  id="session-name"
                  value={sessionId}
                  readOnly
                  className="bg-muted"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-connect">Conectar automaticamente</Label>
                  <p className="text-sm text-muted-foreground">
                    Tenta reconectar automaticamente se o dispositivo se desconectar
                  </p>
                </div>
                <Switch id="auto-connect" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Salvar histórico</Label>
                  <p className="text-sm text-muted-foreground">
                    Salva o histórico de conversas no banco de dados
                  </p>
                </div>
                <Switch id="save-history" defaultChecked />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="autoresponder" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-reply">Resposta automática</Label>
                <p className="text-sm text-muted-foreground">
                  Responde automaticamente a mensagens recebidas
                </p>
              </div>
              <Switch 
                id="auto-reply" 
                checked={autoReplyEnabled} 
                onCheckedChange={setAutoReplyEnabled} 
                disabled={saving}
              />
            </div>
            
            {autoReplyEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Mensagem de boas-vindas</Label>
                  <textarea
                    id="welcome-message"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="first-msg-daily">Primeira mensagem do dia</Label>
                    <p className="text-sm text-muted-foreground">
                      Responde apenas à primeira mensagem do dia de cada contato
                    </p>
                  </div>
                  <Switch 
                    id="first-msg-daily" 
                    checked={firstMsgDailyEnabled} 
                    onCheckedChange={setFirstMsgDailyEnabled} 
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delay-seconds" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Delay de resposta (segundos)
                  </Label>
                  <Input
                    id="delay-seconds"
                    type="number"
                    min="0"
                    max="30"
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(parseInt(e.target.value))}
                    disabled={saving}
                  />
                  <p className="text-sm text-muted-foreground">
                    Configura um atraso antes de enviar a resposta automática
                  </p>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-message-notification">Notificações de novas mensagens</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando novas mensagens chegarem
                </p>
              </div>
              <Switch id="new-message-notification" defaultChecked disabled={saving} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="connection-notification">Notificações de conexão</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando o dispositivo conectar ou desconectar
                </p>
              </div>
              <Switch id="connection-notification" defaultChecked disabled={saving} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por e-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações importantes por e-mail
                </p>
              </div>
              <Switch id="email-notifications" disabled={saving} />
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6" />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" disabled={saving}>Cancelar</Button>
          <Button 
            onClick={handleSaveConfig}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Configurações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSettings;
