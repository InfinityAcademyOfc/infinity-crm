import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { logError } from "@/utils/logger"; // Importar o logger

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  value?: number;
  company_id: string;
}

interface ConvertLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onConvert: (leadId: string, clientData: any) => Promise<void>;
}

export const ConvertLeadDialog: React.FC<ConvertLeadDialogProps> = ({
  open,
  onOpenChange,
  lead,
  onConvert
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      setLoading(true);
      
      const clientData = {
        name: formData.get("name") as string,
        contact: formData.get("contact") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        segment: formData.get("segment") as string,
        status: "active",
        company_id: lead.company_id,
        source: "lead_conversion",
        notes: formData.get("notes") as string,
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string
      };

      await onConvert(lead.id, clientData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      logError("Erro ao converter lead:", error, { component: "ConvertLeadDialog" });
      toast({
        title: "Erro",
        description: "Erro ao converter lead em cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Converter Lead em Cliente</DialogTitle>
          <DialogDescription>
            Complete as informações para converter "{lead?.name}" em cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa*</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={lead?.name || ""}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Pessoa de Contato</Label>
              <Input 
                id="contact" 
                name="contact" 
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email"
                defaultValue={lead?.email || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                name="phone" 
                defaultValue={lead?.phone || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Segmento</Label>
            <Select name="segment">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="varejo">Varejo</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
                <SelectItem value="industria">Indústria</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="educacao">Educação</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Informações adicionais sobre o cliente..."
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Endereço (Opcional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input id="street" name="street" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" name="city" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input id="state" name="state" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zip">CEP</Label>
                <Input id="zip" name="zip" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Convertendo..." : "Converter em Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


