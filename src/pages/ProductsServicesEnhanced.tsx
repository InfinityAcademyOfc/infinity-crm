
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { productService } from "@/services/api/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductsServicesEnhanced = () => {
  const { user, companyProfile } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const companyId = companyProfile?.company_id || user?.id || "";

  const { data: products = [] } = useQuery({
    queryKey: ['products', companyId],
    queryFn: () => productService.getProducts(companyId),
    enabled: !!companyId,
    staleTime: 30000,
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      company_id: companyId
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await productService.createProduct(productData);
        toast.success("Produto criado com sucesso!");
      }
      
      queryClient.invalidateQueries({ queryKey: ['products', companyId] });
      setDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      toast.error("Erro ao salvar produto");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      queryClient.invalidateQueries({ queryKey: ['products', companyId] });
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Produtos e Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos e serviços
          </p>
        </div>
        
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {product.description}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Preço:</span>
                  <span className="font-semibold">
                    R$ {product.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Categoria:</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingProduct(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do produto ou serviço.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome*</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ""}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingProduct?.description || ""}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingProduct?.price || ""}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select name="category" defaultValue={editingProduct?.category || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="servico">Serviço</SelectItem>
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status*</Label>
              <Select name="status" defaultValue={editingProduct?.status || "active"} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsServicesEnhanced;
