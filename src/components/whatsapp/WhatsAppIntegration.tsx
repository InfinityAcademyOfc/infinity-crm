
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";
import QRCodeModal from "./QRCodeModal";
import WhatsAppMenuLayout from "./WhatsAppMenuLayout";

const WhatsAppIntegration = () => {
  const [status, setStatus] = useState<WhatsAppConnectionStatus>("not_started");
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();
  const sessionId = "nova-sessao"; // Fixed for now but can be made dynamic in the future

  // In a production app, redirect to the new WhatsApp dashboard page
  // return <Navigate to="/app/whatsapp-dashboard" replace />;

  // Update status periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          console.warn("VITE_API_URL is not defined - using mock status");
          setStatus("not_started"); // Use a mock status for development
          return;
        }

        const res = await fetch(`${apiUrl}/sessions/${sessionId}/status`);
        if (!res.ok) throw new Error("Error fetching status");

        const data = await res.json();
        console.log("📶 Status updated:", data.status);
        setStatus(data.status as WhatsAppConnectionStatus);
      } catch (err) {
        console.error("Error fetching status:", err);
        // Don't set to error here to allow UI to still be visible
        // Just keep the current status
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 7000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) throw new Error("VITE_API_URL is not defined");

      const res = await fetch(`${apiUrl}/sessions/${sessionId}/logout`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error("Error disconnecting");

      setStatus("not_started");
      toast({
        title: "Disconnected",
        description: "Session disconnected successfully.",
      });
    } catch (err) {
      toast({
        title: "Error disconnecting",
        description: "Failed to disconnect from WhatsApp.",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleShowQrCode = () => setShowQrModal(true);

  const handleLogin = () => {
    setStatus("connected");
    setShowQrModal(false);
    toast({
      title: "Connected",
      description: "Device connected successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">WhatsApp Integration</h2>
      </div>

      {/* Always render the layout, even if status is "not_started" */}
      <Card>
        <CardContent className="p-6">
          <WhatsAppMenuLayout
            sessionId={sessionId}
            status={status}
            onShowQrCode={handleShowQrCode}
            onLogout={handleLogout}
          />
        </CardContent>
      </Card>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={sessionId}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppIntegration;
