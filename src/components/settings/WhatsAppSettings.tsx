
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Smartphone, Zap, Settings } from "lucide-react";
import { toast } from "sonner";

const WhatsAppSettings = () => {
  const [settings, setSettings] = useState({
    autoReply: false,
    businessHours: false,
    webhookUrl: '',
    apiToken: ''
  });

  const handleSave = () => {
    toast.success("Configurações do WhatsApp salvas com sucesso!");
  };

  const handleConnect = () => {
    toast.info("Conectar WhatsApp será implementado em breve");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conexão WhatsApp
          </CardTitle>
          <CardDescription>
            Configure a integração com WhatsApp para automatizar atendimentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium">Status da Conexão</h4>
                <p className="text-sm text-muted-foreground">Desconectado</p>
              </div>
            </div>
            <Button onClick={handleConnect}>
              Conectar WhatsApp
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Para conectar seu WhatsApp, você precisará escanear um código QR com seu dispositivo móvel.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Automações
          </CardTitle>
          <CardDescription>
            Configure respostas automáticas e horários de funcionamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Resposta Automática</p>
              <p className="text-sm text-muted-foreground">
                Enviar mensagem automática para novos contatos
              </p>
            </div>
            <Switch
              checked={settings.autoReply}
              onCheckedChange={(autoReply) => setSettings({ ...settings, autoReply })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Horário Comercial</p>
              <p className="text-sm text-muted-foreground">
                Ativar respostas automáticas fora do horário comercial
              </p>
            </div>
            <Switch
              checked={settings.businessHours}
              onCheckedChange={(businessHours) => setSettings({ ...settings, businessHours })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Configure integrações e webhooks para desenvolvedores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook">URL do Webhook</Label>
            <Input
              id="webhook"
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              placeholder="https://sua-api.com/webhook"
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL para receber eventos do WhatsApp
            </p>
          </div>
          
          <div>
            <Label htmlFor="token">Token da API</Label>
            <Input
              id="token"
              type="password"
              value={settings.apiToken}
              onChange={(e) => setSettings({ ...settings, apiToken: e.target.value })}
              placeholder="Seu token da API WhatsApp"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Token para autenticação da API
            </p>
          </div>
          
          <Button onClick={handleSave} className="w-full">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSettings;
