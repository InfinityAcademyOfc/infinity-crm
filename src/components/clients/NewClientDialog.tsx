import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void;
  onSave?: (data: any) => void;
  onAddClient?: (data: any) => void;
}

const NewClientDialog = ({
  open,
  onOpenChange,
  onClientCreated,
  onSave,
  onAddClient,
}: NewClientDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [source, setSource] = useState("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState("bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300");
  const [tags, setTags] = useState<Array<{ label: string; color: string }>>([]);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { company: userCompany } = useAuth();
  
  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setSource("");
    setValue("");
    setNotes("");
    setTag("");
    setTagColor("bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300");
    setTags([]);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };
  
  const handleSave = async () => {
    if (!name || !email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!userCompany?.id) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          name,
          email,
          phone,
          contact: company,
          segment: source,
          status: 'active',
          company_id: userCompany.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Cliente adicionado",
        description: `${name} foi adicionado com sucesso.`,
      });

      if (onClientCreated) {
        onClientCreated();
      }

      if (onSave) {
        onSave(data);
      }

      if (onAddClient) {
        onAddClient(data);
      }
      
      handleClose();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar cliente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTag = () => {
    if (tag && !tags.some((t) => t.label === tag)) {
      setTags([...tags, { label: tag, color: tagColor }]);
      setTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t.label !== tagToRemove));
  };
  
  const formatCurrency = (value: string) => {
    let numericValue = value.replace(/\D/g, "");
    numericValue = numericValue.replace(/(\d)(\d{2})$/, "$1,$2");
    numericValue = numericValue.replace(/(?=(\d{3})+(\D))\B/g, ".");
    
    return numericValue ? `R$ ${numericValue}` : "";
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do cliente"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Segmento</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Selecionar segmento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="value">Valor potencial</Label>
            <Input
              id="value"
              value={formatCurrency(value)}
              onChange={(e) => setValue(e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais sobre o cliente"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((t) => (
                <Badge key={t.label} className={`${t.color} flex items-center gap-1`}>
                  {t.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t.label)}
                    className="ml-1 rounded-full hover:bg-background/20 p-1"
                  >
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Nova tag"
                className="flex-grow"
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Select value={tagColor} onValueChange={setTagColor}>
                <SelectTrigger className="w-[120px] flex-shrink-0">
                  <SelectValue placeholder="Cor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Azul
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Verde
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      Vermelho
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      Amarelo
                    </div>
                  </SelectItem>
                  <SelectItem value="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      Roxo
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientDialog;
