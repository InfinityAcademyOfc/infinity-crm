
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Send, 
  FileImage,
  Calendar, 
  ListOrdered, 
  Zap,
  AlertCircle,
  Smartphone,
  LogOut,
  Trash2,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import WhatsAppConversations from "./WhatsAppConversations";
import ContactsManager from "./contacts/ContactsManager";
import ListsManager from "./lists/ListsManager";
import BroadcastManager from "./broadcasts/BroadcastManager";
import MediaManager from "./media/MediaManager";
import ScheduleManager from "./schedules/ScheduleManager";
import WhatsAppConfig from "./config/WhatsAppConfig";
import AutomationsManager from "./automations/AutomationsManager";
import QRCodeModal from "./QRCodeModal";
import { WhatsAppConnectionStatus } from "@/hooks/useQRCode";

interface WhatsAppMenuLayoutProps {
  sessionId?: string;
  status?: WhatsAppConnectionStatus;
  onShowQrCode?: () => void;
  onLogout?: () => void;
}

const WhatsAppMenuLayout = ({ 
  sessionId = "teste",
  status = "not_started",
  onShowQrCode,
  onLogout
}: WhatsAppMenuLayoutProps) => {
  const [activeTab, setActiveTab] = useState("conversations");
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Connection status received in MenuLayout:", status);
  }, [status]);

  const handleDisconnect = () => {
    if (onLogout) {
      onLogout();
      toast({
        title: "WhatsApp disconnected",
        description: "Your WhatsApp session has been successfully disconnected."
      });
    }
  };

  const handleNewConnection = () => {
    setShowQrModal(true);
  };

  const handleLogin = () => {
    toast({
      title: "WhatsApp Connected",
      description: "New number connected successfully!"
    });
  };

  const handleDeleteSession = async () => {
    const confirm = window.confirm("Are you sure you want to delete this WhatsApp session?");
    if (!confirm) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      if (!apiUrl) throw new Error("API URL is not defined");
      
      const res = await fetch(`${apiUrl}/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error("Error deleting session");

      toast({
        title: "Session deleted",
        description: "All data has been successfully removed.",
        variant: "default"
      });

      // Force a status update or redirect
      location.reload();
    } catch (err) {
      toast({
        title: "Error deleting",
        description: "Could not delete the session.",
        variant: "destructive"
      });
      console.error("Error deleting session:", err);
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            status === "connected" 
              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              status === "connected" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"
            }`}></div>
            <span className="text-sm font-medium">
              {status === "connected" ? "Connected" : "Waiting for connection"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleNewConnection}
          >
            <Smartphone size={14} /> New number
          </Button>

          {status === "connected" && (
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              <LogOut size={14} /> Disconnect
            </Button>
          )}
        </div>
      </div>

      {/* Alert notification when not connected */}
      {status !== "connected" && (
        <Alert variant="default" className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Waiting for WhatsApp connection. Scan the QR Code or reconnect the number.
          </AlertDescription>
        </Alert>
      )}

      {/* Always render tabs - regardless of connection status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-4 border-b overflow-x-auto">
          <TabsList className="h-auto p-0 bg-transparent w-full justify-start">
            <TabsTrigger value="dashboard" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="conversations" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <MessageSquare className="mr-2 h-4 w-4" /> Conversations
            </TabsTrigger>
            <TabsTrigger value="contacts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Users className="mr-2 h-4 w-4" /> Contacts
            </TabsTrigger>
            <TabsTrigger value="lists" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <ListOrdered className="mr-2 h-4 w-4" /> Lists
            </TabsTrigger>
            <TabsTrigger value="broadcasts" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Send className="mr-2 h-4 w-4" /> Broadcast
            </TabsTrigger>
            <TabsTrigger value="schedules" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Calendar className="mr-2 h-4 w-4" /> Schedules
            </TabsTrigger>
            <TabsTrigger value="media" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <FileImage className="mr-2 h-4 w-4" /> Media
            </TabsTrigger>
            <TabsTrigger value="automations" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Zap className="mr-2 h-4 w-4" /> Automations
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-2">WhatsApp Status</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={status === "connected" ? "text-green-500 font-medium" : "text-yellow-500 font-medium"}>
                    {status === "connected" ? "Connected" : "Waiting for connection"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session ID:</span>
                  <span className="font-mono text-sm">{sessionId}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleNewConnection}>
                <Smartphone size={14} className="mr-2" /> Connect New Number
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start" onClick={() => setActiveTab("broadcasts")}>
                  <Send size={14} className="mr-2" /> New Broadcast
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => setActiveTab("automations")}>
                  <Zap size={14} className="mr-2" /> New Automation
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => setActiveTab("contacts")}>
                  <Users size={14} className="mr-2" /> Add Contact
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => setActiveTab("lists")}>
                  <ListOrdered size={14} className="mr-2" /> New List
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="conversations"><WhatsAppConversations sessionId={sessionId} /></TabsContent>
        <TabsContent value="contacts"><ContactsManager /></TabsContent>
        <TabsContent value="lists"><ListsManager /></TabsContent>
        <TabsContent value="broadcasts"><BroadcastManager /></TabsContent>
        <TabsContent value="schedules"><ScheduleManager /></TabsContent>
        <TabsContent value="media"><MediaManager /></TabsContent>
        <TabsContent value="automations"><AutomationsManager /></TabsContent>
        <TabsContent value="settings"><WhatsAppConfig /></TabsContent>
      </Tabs>

      <QRCodeModal
        open={showQrModal}
        onOpenChange={setShowQrModal}
        sessionId={sessionId || "new-number"}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default WhatsAppMenuLayout;
