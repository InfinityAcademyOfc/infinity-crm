
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { useQRCode } from "@/hooks/useQRCode";
import { useWhatsApp } from "@/contexts/WhatsAppContext";
import { toast } from "sonner";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  onLogin?: () => void;
}

const QRCodeModal = ({ open, onOpenChange, sessionId, onLogin }: QRCodeModalProps) => {
  const { qrCodeData, status, loading, error } = useQRCode(sessionId);
  const { isApiAvailable, refreshSessions } = useWhatsApp();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh QR code every 30 seconds if not connected
  useEffect(() => {
    if (!open || !autoRefresh || status === "connected") return;
    
    const interval = setInterval(() => {
      if (status === "qr" || status === "loading") {
        // QR code will be refreshed by the useQRCode hook
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [open, autoRefresh, status]);

  // Handle successful connection
  useEffect(() => {
    if (status === "connected") {
      toast.success("WhatsApp conectado com sucesso!");
      refreshSessions();
      if (onLogin) onLogin();
      
      // Close modal after a brief delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    }
  }, [status, onLogin, refreshSessions, onOpenChange]);

  const handleManualRefresh = () => {
    // The useQRCode hook will handle the refresh
    toast.info("Atualizando QR Code...");
  };

  const getStatusBadge = () => {
    switch (status) {
      case "loading":
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Carregando</Badge>;
      case "qr":
        return <Badge variant="default"><Smartphone className="w-3 h-3 mr-1" />Escaneie o QR</Badge>;
      case "connected":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Conectado</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Erro</Badge>;
      default:
        return <Badge variant="outline">Aguardando</Badge>;
    }
  };

  const renderContent = () => {
    if (!isApiAvailable) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium">API não disponível</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  A API do WhatsApp não está disponível. O sistema está funcionando em modo simulado.
                </p>
              </div>
              <Button onClick={() => onOpenChange(false)} className="w-full">
                Continuar em Modo Simulado
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (loading && !qrCodeData) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Iniciando sessão WhatsApp...</p>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Erro de Conexão</h3>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </div>
              <Button onClick={handleManualRefresh} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (status === "connected") {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-green-700">Conectado com Sucesso!</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Seu WhatsApp foi conectado e está pronto para uso.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (qrCodeData) {
      return (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <img 
                  src={qrCodeData} 
                  alt="QR Code WhatsApp" 
                  className="mx-auto border rounded-lg shadow-sm bg-white p-4"
                  style={{ maxWidth: "280px", width: "100%" }}
                />
              </div>
              
              <div className="space-y-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Como conectar:</span>
                </div>
                
                <ol className="text-sm text-muted-foreground space-y-1 text-left max-w-xs mx-auto">
                  <li>1. Abra o WhatsApp no seu celular</li>
                  <li>2. Toque em "Dispositivos conectados"</li>
                  <li>3. Toque em "Conectar dispositivo"</li>
                  <li>4. Escaneie este código QR</li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar QR
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Auto-refresh:</span>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
              >
                {autoRefresh ? "Ativo" : "Inativo"}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Preparando QR Code...</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Conectar WhatsApp</DialogTitle>
            {getStatusBadge()}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {renderContent()}
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {status === "connected" ? "Fechar" : "Cancelar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
