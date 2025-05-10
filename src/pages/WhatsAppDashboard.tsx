
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSessions } from "@/hooks/useSessions";
import WhatsAppMenuLayout from "@/components/whatsapp/WhatsAppMenuLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, AlertCircle, Smartphone } from "lucide-react";
import QRCodeModal from "@/components/whatsapp/QRCodeModal";
import { Badge } from "@/components/ui/badge";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

const WhatsAppDashboard = () => {
  const [selectedSessionId, setSelectedSessionId] = useState("nova-sessao");
  const [showQrModal, setShowQrModal] = useState(false);
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const { sessions, loading } = useSessions();
  const { toast } = useToast();
  
  const handleConnectClick = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowQrModal(true);
  };

  const handleLogin = () => {
    setStatus("connected");
    setShowQrModal(false);
    toast({
      title: "WhatsApp Connected",
      description: "Device connected successfully.",
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">WhatsApp Dashboard</h2>
            <Button 
              variant="outline" 
              onClick={() => handleConnectClick("nova-sessao")}
              className="flex items-center gap-2"
            >
              <Smartphone size={18} /> Connect New Number
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">Connected Sessions</h3>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader className="animate-spin" size={20} />
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle size={20} />
                    <p>No WhatsApp numbers connected</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect your first WhatsApp number to start sending messages.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="border rounded-lg p-3 flex justify-between items-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => setSelectedSessionId(session.id)}
                    >
                      <div>
                        <p className="font-medium">{session.name || session.id}</p>
                        <Badge 
                          variant={session.status === "CONNECTED" ? "default" : "outline"}
                          className={session.status === "CONNECTED" ? "bg-green-600" : ""}
                        >
                          {session.status === "CONNECTED" ? "Connected" : "Disconnected"}
                        </Badge>
                      </div>
                      {session.status !== "CONNECTED" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnectClick(session.id);
                          }}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp Main Content */}
        <div className="w-full lg:w-2/3">
          <Card>
            <CardContent className="p-0">
              <WhatsAppMenuLayout 
                sessionId={selectedSessionId}
                status={status}
                onShowQrCode={() => setShowQrModal(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={selectedSessionId}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppDashboard;
