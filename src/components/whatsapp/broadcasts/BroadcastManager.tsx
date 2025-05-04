
import { useState, useEffect } from "react";
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
  MessageSquare,
  UsersRound,
  Timer,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BroadcastFormDialog from "./BroadcastFormDialog";
import { supabase } from "@/lib/supabase";

interface Broadcast {
  id: string;
  title: string;
  message?: string;
  media_url?: string;
  scheduled_for?: string;
  status: 'scheduled' | 'sending' | 'completed' | 'failed';
  created_at: string;
}

const BroadcastManager = () => {
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  
  // Fetch broadcasts from Supabase
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("whatsapp_broadcasts")
          .select("*")
          .order("scheduled_for", { ascending: false });
          
        if (error) throw error;
        setBroadcasts(data || []);
      } catch (error) {
        console.error("Error fetching broadcasts:", error);
        toast({
          title: "Erro ao carregar broadcasts",
          description: "Não foi possível carregar as campanhas. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBroadcasts();

    // Set up real-time listener for broadcasts updates
    const channel = supabase
      .channel("whatsapp_broadcasts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_broadcasts",
        },
        (payload) => {
          fetchBroadcasts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
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
            scheduled_for: broadcast.scheduled_for
          })
          .eq("id", selectedBroadcast.id);
          
        if (error) throw error;
        
        toast({
          title: "Campanha atualizada",
          description: "A campanha foi atualizada com sucesso."
        });
      } else {
        // Create new broadcast
        const { data, error } = await supabase
          .from("whatsapp_broadcasts")
          .insert({
            title: broadcast.title,
            message: broadcast.message,
            media_url: broadcast.media_url,
            scheduled_for: broadcast.scheduled_for,
            status: 'scheduled'
          })
          .select();
          
        if (error) throw error;
        
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
  
  // Filter broadcasts based on search term
  const filteredBroadcasts = broadcasts.filter(broadcast => 
    broadcast.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broadcast.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock size={12} /> Agendado
        </Badge>;
      case 'sending':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Timer size={12} /> Enviando
        </Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600 flex items-center gap-1">
          <CheckCircle size={12} /> Concluído
        </Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle size={12} /> Falha
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
                  <TableHead className="w-[100px]">Ações</TableHead>
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
                      <TableCell className="font-medium">{broadcast.title}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate">
                          {broadcast.message || "Sem mensagem"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-muted-foreground" />
                          {broadcast.scheduled_for 
                            ? new Date(broadcast.scheduled_for).toLocaleString()
                            : "Não agendado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(broadcast.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditBroadcast(broadcast)}
                            disabled={broadcast.status === 'sending' || broadcast.status === 'completed'}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBroadcast(broadcast.id)}
                            disabled={broadcast.status === 'sending'}
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
        />
      </CardContent>
    </Card>
  );
};

export default BroadcastManager;
