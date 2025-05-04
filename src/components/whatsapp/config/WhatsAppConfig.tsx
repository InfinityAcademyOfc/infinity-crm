
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Bell, Clock, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const WhatsAppConfig = () => {
  const { toast } = useToast();
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Olá! Obrigado por entrar em contato. Como posso ajudar você hoje?"
  );
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [firstMsgDailyEnabled, setFirstMsgDailyEnabled] = useState(true);
  const [delaySeconds, setDelaySeconds] = useState(2);

  const handleSaveConfig = () => {
    // Here you would save the configuration to Supabase
    toast({
      title: "Configurações salvas",
      description: "Suas configurações de WhatsApp foram salvas com sucesso."
    });
  };

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
                <Label htmlFor="session-name">Nome da sessão</Label>
                <input
                  id="session-name"
                  placeholder="Meu WhatsApp principal"
                  className="border rounded-md p-2"
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delay-seconds" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Delay de resposta (segundos)
                  </Label>
                  <input
                    id="delay-seconds"
                    type="number"
                    min="0"
                    max="30"
                    value={delaySeconds}
                    onChange={(e) => setDelaySeconds(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md"
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
              <Switch id="new-message-notification" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="connection-notification">Notificações de conexão</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações quando o dispositivo conectar ou desconectar
                </p>
              </div>
              <Switch id="connection-notification" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notificações por e-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações importantes por e-mail
                </p>
              </div>
              <Switch id="email-notifications" />
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6" />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppConfig;
