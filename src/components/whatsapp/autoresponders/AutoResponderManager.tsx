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
  MessageSquare,
  Clock,
  ToggleLeft, 
  ToggleRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AutoResponderFormDialog from "./AutoResponderFormDialog";
import { supabase } from "@/integrations/supabase"; // Importar do index.ts
import { logError } from "@/utils/logger"; // Importar o logger

interface AutoResponder {
  id: string;
  keyword?: string;
  response?: string;
  media_url?: string;
  trigger_type?: string;
  delay_seconds: number;
  active: boolean;
  created_at: string;
  session_id?: string;
}

interface AutoResponderManagerProps {
  sessionId: string;
}

const AutoResponderManager = ({ sessionId }: AutoResponderManagerProps) => {
  const { toast } = useToast();
  const [autoResponders, setAutoResponders] = useState<AutoResponder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAutoResponder, setSelectedAutoResponder] = useState<AutoResponder | null>(null);
  
  // Fetch autoResponders from Supabase using the sessionId
  useEffect(() => {
    const fetchAutoResponders = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("whatsapp_autoresponders")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAutoResponders(data || []);
      } catch (error) {
        logError("Erro ao buscar autoresponders:", error, { component: "AutoResponderManager" });
        toast({
          title: "Erro ao carregar respostas automáticas",
          description: "Não foi possível carregar as respostas automáticas.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutoResponders();

    const channel = supabase
      .channel("autoresponders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_autoresponders",
          filter: `session_id=eq.${sessionId}`
        },
        () => {
          fetchAutoResponders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, sessionId]);

  const handleAddAutoResponder = () => {
    setSelectedAutoResponder(null);
    setFormOpen(true);
  };

  const handleEditAutoResponder = (autoResponder: AutoResponder) => {
    setSelectedAutoResponder(autoResponder);
    setFormOpen(true);
  };

  const handleDeleteAutoResponder = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta resposta automática?")) return;
    
    try {
      const { error } = await supabase
        .from("whatsapp_autoresponders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setAutoResponders(autoResponders.filter(ar => ar.id !== id));
      toast({
        title: "Resposta excluída",
        description: "A resposta automática foi excluída com sucesso."
      });
    } catch (error) {
      logError("Error deleting auto responder:", error, { component: "AutoResponderManager" });
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a resposta automática.",
        variant: "destructive"
      });
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("whatsapp_autoresponders")
        .update({ active: !active })
        .eq("id", id);
        
      if (error) throw error;
      
      setAutoResponders(autoResponders.map(ar => 
        ar.id === id ? { ...ar, active: !active } : ar
      ));
      
      toast({
        title: `Resposta ${!active ? "ativada" : "desativada"}`,
        description: `A resposta automática foi ${!active ? "ativada" : "desativada"} com sucesso.`
      });
    } catch (error) {
      logError("Error toggling auto responder:", error, { component: "AutoResponderManager" });
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status da resposta automática. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveAutoResponder = async (autoResponder: Partial<AutoResponder>) => {
    try {
      if (selectedAutoResponder) {
        // Update existing auto responder
        const { error } = await supabase
          .from("whatsapp_autoresponders")
          .update({
            keyword: autoResponder.keyword,
            response: autoResponder.response,
            media_url: autoResponder.media_url,
            trigger_type: autoResponder.trigger_type,
            delay_seconds: autoResponder.delay_seconds
          })
          .eq("id", selectedAutoResponder.id);
          
        if (error) throw error;
        
        toast({
          title: "Resposta automática atualizada",
          description: "A resposta automática foi atualizada com sucesso."
        });
      } else {
        // Create new auto responder
        const { data, error } = await supabase
          .from("whatsapp_autoresponders")
          .insert({
            keyword: autoResponder.keyword,
            response: autoResponder.response,
            media_url: autoResponder.media_url,
            trigger_type: autoResponder.trigger_type,
            delay_seconds: autoResponder.delay_seconds || 1,
            active: true,
            session_id: sessionId // Important!
          })
          .select();
          
        if (error) throw error;
        
        toast({
          title: "Resposta automática criada",
          description: "A nova resposta automática foi criada com sucesso."
        });
      }
      
      setFormOpen(false);
    } catch (error) {
      logError("Error saving auto responder:", error, { component: "AutoResponderManager" });
      toast({
        title: "Erro ao salvar resposta automática",
        description: "Não foi possível salvar a resposta automática. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Filter autoResponders based on search term
  const filteredAutoResponders = autoResponders.filter(ar => 
    (ar.keyword?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (ar.response?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (ar.trigger_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar respostas automáticas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleAddAutoResponder}>
              <Plus size={16} className="mr-2" /> Nova Resposta Automática
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando respostas automáticas...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gatilho</TableHead>
                  <TableHead>Resposta</TableHead>
                  <TableHead>Delay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAutoResponders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhuma resposta automática encontrada" : "Nenhuma resposta automática cadastrada"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAutoResponders.map((autoResponder) => (
                    <TableRow key={autoResponder.id}>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <Badge variant="outline" className="mb-1">
                            {autoResponder.trigger_type === "keyword" ? "Palavra-chave" : 
                             autoResponder.trigger_type === "first_message" ? "Primeira mensagem" :
                             autoResponder.trigger_type === "first_daily" ? "Primeira do dia" :
                             "Gatilho personalizado"}
                          </Badge>
                          <div className="truncate font-medium">
                            {autoResponder.keyword || "Sem palavra-chave"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate">
                          {autoResponder.response || "Sem resposta definida"}
                        </div>
                        {autoResponder.media_url && (
                          <Badge variant="outline" className="mt-1">Mídia</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-muted-foreground" />
                          {autoResponder.delay_seconds} segundo{autoResponder.delay_seconds !== 1 ? "s" : ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={autoResponder.active}
                          onCheckedChange={() => handleToggleActive(autoResponder.id, autoResponder.active)}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAutoResponder(autoResponder)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAutoResponder(autoResponder.id)}
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
        
        <AutoResponderFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          autoResponder={selectedAutoResponder}
          onSave={handleSaveAutoResponder}
          sessionId={sessionId}
        />
      </CardContent>
    </Card>
  );
};

export default AutoResponderManager;


