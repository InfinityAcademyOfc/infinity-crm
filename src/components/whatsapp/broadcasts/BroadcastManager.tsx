import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Send,
  FileImage,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BroadcastFormDialog from "./BroadcastFormDialog";
import { supabase } from "@/integrations/supabase";

interface Broadcast {
  id: string;
  title: string;
  message?: string;
  media_url?: string;
  scheduled_for?: string;
  status?: string;
  session_id?: string;
}

interface BroadcastManagerProps {
  sessionId: string;
}

const BroadcastManager = ({ sessionId }: BroadcastManagerProps) => {
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  
  // Fetch broadcasts using sessionId
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("whatsapp_broadcasts")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setBroadcasts(data || []);
      } catch (error) {
        console.error("Error fetching broadcasts:", error);
        toast({
          title: "Erro ao carregar campanhas",
          description: "Não foi possível carregar as campanhas. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBroadcasts();
  }, [toast, sessionId]);
  
  const handleAddBroadcast = () => {
    setSelectedBroadcast(null);
    setFormOpen(true);
  };
  
  const handleEditBroadcast = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setFormOpen(true);
  };
  
  const handleDeleteBroadcast = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_broadcasts")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setBroadcasts(broadcasts.filter(broadcast => broadcast.id !== id));
      toast({
        title: "Campanha excluída",
        description: "A campanha foi excluída com sucesso."
      });
    } catch (error) {
      console.error("Error deleting broadcast:", error);
      toast({
        title: "Erro ao excluir campanha",
        description: "Não foi possível excluir a campanha. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveBroadcast = async (broadcast: Partial<Broadcast>) => {
    try {
      if (selectedBroadcast) {
        // Update existing broadcast
        const { error } = await supabase
          .from("whatsapp_broadcasts")
          .update({
            title: broadcast.title,
            message: broadcast.message,
            media_url: broadcast.media_url,
            scheduled_for: broadcast.scheduled_for,
            status: broadcast.status || selectedBroadcast.status
          })
          .eq("id", selectedBroadcast.id);
          
        if (error) throw error;
        
        setBroadcasts(broadcasts.map(b => 
          b.id === selectedBroadcast.id ? { ...b, ...broadcast } : b
        ));
        
        toast({
          title: "Campanha atualizada",
          description: "A campanha foi atualizada com sucesso."
        });
      } else {
        // Create new broadcast with sessionId
        const { data, error } = await supabase
          .from("whatsapp_broadcasts")
          .insert({
            title: broadcast.title,
            message: broadcast.message,
            media_url: broadcast.media_url,
            scheduled_for: broadcast.scheduled_for,
            status: broadcast.status || "scheduled",
            session_id: sessionId // Add session_id
          })
          .select();
          
        if (error) throw error;
        
        setBroadcasts([data[0], ...broadcasts]);
        
        toast({
          title: "Campanha criada",
          description: "A nova campanha foi criada com sucesso."
        });
      }
      
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving broadcast:", error);
      toast({
        title: "Erro ao salvar campanha",
        description: "Não foi possível salvar a campanha. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Send broadcast now
  const handleSendNow = async (id: string) => {
    try {
      const { error } = await supabase
        .from("whatsapp_broadcasts")
        .update({ status: "processing" })
        .eq("id", id);
        
      if (error) throw error;
      
      setBroadcasts(broadcasts.map(b => 
        b.id === id ? { ...b, status: "processing" } : b
      ));
      
      // Todo: Call API to process the broadcast
      
      toast({
        title: "Processando campanha",
        description: "A campanha está sendo processada e em breve será enviada."
      });
    } catch (error) {
      console.error("Error sending broadcast:", error);
      toast({
        title: "Erro ao processar campanha",
        description: "Não foi possível iniciar o processamento da campanha. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Filter broadcasts based on search term
  const filteredBroadcasts = broadcasts.filter(broadcast => 
    broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (broadcast.message && broadcast.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar campanhas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleAddBroadcast}>
              <Plus size={16} className="mr-2" /> Nova Campanha
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando campanhas...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBroadcasts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhuma campanha encontrada" : "Nenhuma campanha cadastrada"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBroadcasts.map((broadcast) => (
                    <TableRow key={broadcast.id}>
                      <TableCell>{broadcast.title}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate">
                          {broadcast.message || "Sem mensagem"}
                        </div>
                        {broadcast.media_url && (
                          <Badge variant="outline" className="mt-1">
                            <FileImage size={12} className="mr-1" /> Mídia
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {broadcast.scheduled_for ? (
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-muted-foreground" />
                            {new Date(broadcast.scheduled_for).toLocaleString()}
                          </div>
                        ) : (
                          <Badge variant="outline">Não agendado</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {broadcast.status === "scheduled" && (
                          <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">
                            <Clock size={12} className="mr-1" /> Agendado
                          </Badge>
                        )}
                        {broadcast.status === "processing" && (
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            <Send size={12} className="mr-1" /> Processando
                          </Badge>
                        )}
                        {broadcast.status === "sent" && (
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            <CheckCircle size={12} className="mr-1" /> Enviado
                          </Badge>
                        )}
                        {broadcast.status === "failed" && (
                          <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                            <AlertCircle size={12} className="mr-1" /> Falhou
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendNow(broadcast.id)}
                            disabled={broadcast.status === "processing" || broadcast.status === "sent"}
                          >
                            <Send size={14} className="mr-2" /> Enviar
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBroadcast(broadcast)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBroadcast(broadcast.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        <BroadcastFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          broadcast={selectedBroadcast}
          onSave={handleSaveBroadcast}
          sessionId={sessionId}
        />
      </CardContent>
    </Card>
  );
};

export default BroadcastManager;
