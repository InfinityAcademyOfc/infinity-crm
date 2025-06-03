
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, AlertTriangle, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const SecuritySettings = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordRequireSpecialChars: true
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast.error("Não foi possível alterar a senha");
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityToggle = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast.success(`Configuração ${value ? 'ativada' : 'desativada'} com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Mantenha sua conta segura alterando sua senha regularmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>
            
            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Alterando...
                </>
              ) : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Autenticação de Dois Fatores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Autenticação de Dois Fatores (2FA)
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Ativar 2FA</h4>
              <p className="text-sm text-muted-foreground">
                Use um aplicativo autenticador para gerar códigos de verificação
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => handleSecurityToggle('twoFactorEnabled', checked)}
            />
          </div>
          
          {securitySettings.twoFactorEnabled && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Configuração do 2FA:</strong>
              </p>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Baixe um app autenticador (Google Authenticator, Authy)</li>
                <li>Escaneie o QR Code que será exibido</li>
                <li>Digite o código de 6 dígitos para confirmar</li>
              </ol>
              <Button variant="outline" size="sm" className="mt-3">
                Configurar Agora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Configurações de Segurança
          </CardTitle>
          <CardDescription>
            Configure as opções de segurança e notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notificações de Login</h4>
              <p className="text-sm text-muted-foreground">
                Receba emails quando alguém fizer login na sua conta
              </p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => handleSecurityToggle('loginNotifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Senhas com Caracteres Especiais</h4>
              <p className="text-sm text-muted-foreground">
                Exigir símbolos especiais nas senhas
              </p>
            </div>
            <Switch
              checked={securitySettings.passwordRequireSpecialChars}
              onCheckedChange={(checked) => handleSecurityToggle('passwordRequireSpecialChars', checked)}
            />
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Timeout de Sessão</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Tempo em minutos para logout automático por inatividade
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings(prev => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value) || 30
                }))}
                className="w-20"
                min="5"
                max="480"
              />
              <span className="text-sm text-muted-foreground">minutos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessões Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Sessões Ativas
          </CardTitle>
          <CardDescription>
            Gerencie os dispositivos conectados à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Sessão Atual</h4>
                <p className="text-sm text-muted-foreground">
                  Chrome em Windows • {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Ativo
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Dispositivo Móvel</h4>
                <p className="text-sm text-muted-foreground">
                  Safari em iPhone • Há 2 dias
                </p>
              </div>
              <Button variant="outline" size="sm">
                Revogar
              </Button>
            </div>
          </div>
          
          <Button variant="destructive" size="sm" className="mt-4">
            Desconectar Todos os Dispositivos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
