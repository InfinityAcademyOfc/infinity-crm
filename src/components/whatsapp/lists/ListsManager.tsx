
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
  UsersRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ListFormDialog from "./ListFormDialog";
import { supabase } from "@/lib/supabase";

interface ContactList {
  id: string;
  name: string;
  description?: string;
  contact_ids?: string[];
  filters?: any;
  created_at: string;
  session_id?: string;
}

interface ListsManagerProps {
  sessionId: string;
}

const ListsManager = ({ sessionId }: ListsManagerProps) => {
  const { toast } = useToast();
  const [lists, setLists] = useState<ContactList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);
  
  // Fetch lists from Supabase with sessionId filter
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("lists")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setLists(data || []);
      } catch (error) {
        console.error("Error fetching lists:", error);
        toast({
          title: "Erro ao carregar listas",
          description: "Não foi possível carregar as listas. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLists();
  }, [toast, sessionId]);
  
  const handleAddList = () => {
    setSelectedList(null);
    setFormOpen(true);
  };
  
  const handleEditList = (list: ContactList) => {
    setSelectedList(list);
    setFormOpen(true);
  };
  
  const handleDeleteList = async (id: string) => {
    try {
      const { error } = await supabase
        .from("lists")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setLists(lists.filter(list => list.id !== id));
      toast({
        title: "Lista excluída",
        description: "A lista foi excluída com sucesso."
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        title: "Erro ao excluir lista",
        description: "Não foi possível excluir a lista. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveList = async (list: Partial<ContactList>) => {
    try {
      if (selectedList) {
        // Update existing list
        const { error } = await supabase
          .from("lists")
          .update({
            name: list.name,
            description: list.description,
            contact_ids: list.contact_ids,
            filters: list.filters
          })
          .eq("id", selectedList.id);
          
        if (error) throw error;
        
        setLists(lists.map(l => 
          l.id === selectedList.id ? { ...l, ...list as ContactList } : l
        ));
        
        toast({
          title: "Lista atualizada",
          description: "A lista foi atualizada com sucesso."
        });
      } else {
        // Create new list with session_id
        const { data, error } = await supabase
          .from("lists")
          .insert({
            name: list.name,
            description: list.description,
            contact_ids: list.contact_ids || [],
            filters: list.filters || {},
            session_id: sessionId // Add session_id for the new list
          })
          .select();
          
        if (error) throw error;
        
        setLists([data[0], ...lists]);
        
        toast({
          title: "Lista adicionada",
          description: "A nova lista foi adicionada com sucesso."
        });
      }
      
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving list:", error);
      toast({
        title: "Erro ao salvar lista",
        description: "Não foi possível salvar a lista. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Filter lists based on search term
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar listas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleAddList}>
              <Plus size={16} className="mr-2" /> Nova Lista
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando listas...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Contatos</TableHead>
                  <TableHead>Criado</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhuma lista encontrada" : "Nenhuma lista cadastrada"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell>{list.name}</TableCell>
                      <TableCell>{list.description || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <UsersRound size={16} className="mr-2 text-muted-foreground" />
                          <span>{list.contact_ids?.length || 0} contatos</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(list.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditList(list)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteList(list.id)}
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
        
        <ListFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          list={selectedList}
          onSave={handleSaveList}
          sessionId={sessionId}
        />
      </CardContent>
    </Card>
  );
};

export default ListsManager;
