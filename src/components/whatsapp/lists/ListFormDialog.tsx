
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface ContactList {
  id: string;
  name: string;
  description?: string;
  contact_ids?: string[];
  filters?: any;
}

interface ListFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list: ContactList | null;
  onSave: (list: Partial<ContactList>) => void;
  sessionId: string;
}

const ListFormDialog = ({ 
  open, 
  onOpenChange, 
  list, 
  onSave,
  sessionId
}: ListFormDialogProps) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactIds, setContactIds] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  
  // Reset form when list changes
  useEffect(() => {
    if (list) {
      setName(list.name || "");
      setDescription(list.description || "");
      setContactIds(list.contact_ids || []);
    } else {
      setName("");
      setDescription("");
      setContactIds([]);
    }
  }, [list, open]);
  
  // Fetch contacts from Supabase filtered by sessionId
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoadingContacts(true);
        const { data, error } = await supabase
          .from("contacts")
          .select("id, name, phone")
          .eq("session_id", sessionId)
          .order("name");
          
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
        setIsLoadingContacts(false);
      }
    };
    
    if (open) {
      fetchContacts();
    }
  }, [open, toast, sessionId]);
  
  const handleAddContact = (contactId: string) => {
    if (!contactIds.includes(contactId)) {
      setContactIds([...contactIds, contactId]);
    }
  };
  
  const handleRemoveContact = (contactId: string) => {
    setContactIds(contactIds.filter(id => id !== contactId));
  };
  
  const handleSave = () => {
    // Basic validation
    if (!name.trim()) {
      return;
    }
    
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      contact_ids: contactIds.length > 0 ? contactIds : []
    });
  };
  
  // Get contacts by their IDs
  const selectedContacts = contacts.filter(contact => contactIds.includes(contact.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{list ? "Editar Lista" : "Criar Lista"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
              placeholder="Opcional"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Contatos
            </Label>
            <div className="col-span-3 space-y-4">
              <Popover open={contactsOpen} onOpenChange={setContactsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={contactsOpen}
                    className="w-full justify-between"
                  >
                    Selecionar contatos
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar contatos..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>Nenhum contato encontrado.</CommandEmpty>
                      <CommandGroup>
                        {contacts.map((contact) => (
                          <CommandItem
                            key={contact.id}
                            value={contact.id}
                            onSelect={() => {
                              handleAddContact(contact.id);
                              setContactsOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{contact.name}</span>
                              <span className="text-sm text-muted-foreground">{contact.phone}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                contactIds.includes(contact.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              <div className="flex flex-wrap gap-2 min-h-10">
                {selectedContacts.map((contact) => (
                  <Badge key={contact.id} variant="secondary" className="gap-1">
                    {contact.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M1 1L9 9M1 9L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </Button>
                  </Badge>
                ))}
                {contactIds.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    Nenhum contato selecionado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            {list ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ListFormDialog;
