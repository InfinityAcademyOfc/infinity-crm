
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const ClientFormDialog = ({ open, onOpenChange, onSuccess }: ClientFormDialogProps) => {
  const { user, company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    segment: "",
    status: "active",
    contact: "",
    product_id: "",
    value: ""
  });

  useEffect(() => {
    if (open && company?.id) {
      fetchProducts();
    }
  }, [open, company]);

  const fetchProducts = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .eq('company_id', company.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company?.id) return;

    try {
      setLoading(true);

      const clientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        segment: formData.segment,
        status: formData.status,
        contact: formData.contact,
        company_id: company.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('clients')
        .insert([clientData]);

      if (error) throw error;

      // Se foi selecionado um produto, criar transação financeira
      if (formData.product_id && formData.value) {
        const selectedProduct = products.find(p => p.id === formData.product_id);
        await supabase
          .from('financial_transactions')
          .insert([{
            company_id: company.id,
            type: 'income',
            amount: parseFloat(formData.value),
            description: `Venda - ${selectedProduct?.name || 'Produto'} para ${formData.name}`,
            category: 'vendas',
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            created_by: user.id
          }]);
      }

      toast.success('Cliente criado com sucesso!');
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        segment: "",
        status: "active",
        contact: "",
        product_id: "",
        value: ""
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao criar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Cliente *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input
                id="segment"
                value={formData.segment}
                onChange={(e) => setFormData(prev => ({ ...prev, segment: e.target.value }))}
                placeholder="Ex: Tecnologia, Saúde, Educação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Endereço</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                placeholder="Rua, número"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="Estado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">CEP</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                placeholder="00000-000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_id">Produto/Serviço</Label>
              <Select value={formData.product_id} onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - R$ {product.price?.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Observações</Label>
            <Textarea
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              placeholder="Observações sobre o cliente..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Criar Cliente'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
