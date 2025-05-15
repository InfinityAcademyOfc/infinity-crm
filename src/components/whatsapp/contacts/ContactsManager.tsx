
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
  FileText, 
  Import,
  Filter,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ContactFormDialog from "./ContactFormDialog";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
}

interface ContactsManagerProps {
  sessionId: string;
}

const ContactsManager = ({ sessionId }: ContactsManagerProps) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Fetch contacts from Supabase filtering by sessionId
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setContacts(data || []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast({
          title: "Erro ao carregar contatos",
          description: "Não foi possível carregar os contatos. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [toast, sessionId]);
  
  const handleAddContact = () => {
    setSelectedContact(null);
    setFormOpen(true);
  };
  
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setFormOpen(true);
  };
  
  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setContacts(contacts.filter(contact => contact.id !== id));
      toast({
        title: "Contato excluído",
        description: "O contato foi excluído com sucesso."
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Erro ao excluir contato",
        description: "Não foi possível excluir o contato. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveContact = async (contact: Contact) => {
    try {
      if (selectedContact) {
        // Update existing contact
        const { error } = await supabase
          .from("contacts")
          .update({
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            tags: contact.tags
          })
          .eq("id", selectedContact.id);
          
        if (error) throw error;
        
        setContacts(contacts.map(c => 
          c.id === selectedContact.id ? { ...c, ...contact } : c
        ));
        
        toast({
          title: "Contato atualizado",
          description: "O contato foi atualizado com sucesso."
        });
      } else {
        // Create new contact with sessionId
        const { data, error } = await supabase
          .from("contacts")
          .insert({
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            tags: contact.tags,
            session_id: sessionId // Associate with current session
          })
          .select();
          
        if (error) throw error;
        
        setContacts([data[0], ...contacts]);
        
        toast({
          title: "Contato adicionado",
          description: "O novo contato foi adicionado com sucesso."
        });
      }
      
      setFormOpen(false);
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        title: "Erro ao salvar contato",
        description: "Não foi possível salvar o contato. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar contatos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" /> Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Tag size={16} className="mr-2" /> Tags
            </Button>
            <Button variant="outline" size="sm">
              <Import size={16} className="mr-2" /> Importar
            </Button>
            <Button variant="outline" size="sm">
              <FileText size={16} className="mr-2" /> Exportar
            </Button>
            <Button size="sm" onClick={handleAddContact}>
              <Plus size={16} className="mr-2" /> Adicionar Contato
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando contatos...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum contato encontrado" : "Nenhum contato cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.email || "-"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags?.map((tag, index) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                          {!contact.tags || contact.tags.length === 0 && "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditContact(contact)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteContact(contact.id)}
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
        
        <ContactFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          contact={selectedContact}
          onSave={handleSaveContact}
        />
      </CardContent>
    </Card>
  );
};

export default ContactsManager;
