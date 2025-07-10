
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Package, Edit, Trash2, AlertTriangle } from "lucide-react";
import { productService } from "@/services/api/productService";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface ProductCRUDProps {
  companyId: string;
}

export const ProductCRUD: React.FC<ProductCRUDProps> = ({ companyId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, [companyId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts(companyId);
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string) || 0,
      cost: parseFloat(formData.get('cost') as string) || 0,
      category: formData.get('category') as string,
      sku: formData.get('sku') as string,
      stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
      stock_minimum: parseInt(formData.get('stock_minimum') as string) || 0,
      is_service: formData.get('is_service') === 'on',
      is_active: formData.get('is_active') === 'on',
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
      company_id: companyId
    };

    try {
      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct.id, productData);
        if (updated) {
          setProducts(current => current.map(p => p.id === editingProduct.id ? updated : p));
        }
      } else {
        const created = await productService.createProduct(productData);
        if (created) {
          setProducts(current => [created, ...current]);
        }
      }
      
      setDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    const success = await productService.deleteProduct(productToDelete.id);
    if (success) {
      setProducts(current => current.filter(p => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (product: Product) => {
    if (product.is_service) return null;
    if (product.stock_quantity <= 0) return { label: "Sem Estoque", color: "destructive" };
    if (product.stock_quantity <= product.stock_minimum) return { label: "Estoque Baixo", color: "warning" };
    return { label: "Em Estoque", color: "success" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Produtos e Serviços</h2>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos e serviços</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando produtos...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchQuery ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-md">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.sku && (
                              <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category || "Sem categoria"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          R$ {product.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                        </div>
                        {product.cost && (
                          <div className="text-sm text-muted-foreground">
                            Custo: R$ {product.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.is_service ? (
                          <Badge variant="outline">Serviço</Badge>
                        ) : (
                          <div>
                            <div className="font-medium">{product.stock_quantity}</div>
                            {stockStatus && (
                              <Badge variant={stockStatus.color as any} className="text-xs">
                                {stockStatus.label}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Atualize as informações do produto" : "Adicione um novo produto ao catálogo"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome*</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={editingProduct?.name || ""}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  defaultValue={editingProduct?.sku || ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={editingProduct?.description || ""}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço de Venda</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingProduct?.price || ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Custo</Label>
                <Input 
                  id="cost" 
                  name="cost" 
                  type="number" 
                  step="0.01"
                  defaultValue={editingProduct?.cost || ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input 
                  id="category" 
                  name="category" 
                  defaultValue={editingProduct?.category || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
                <Input 
                  id="stock_quantity" 
                  name="stock_quantity" 
                  type="number"
                  defaultValue={editingProduct?.stock_quantity || 0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_minimum">Estoque Mínimo</Label>
                <Input 
                  id="stock_minimum" 
                  name="stock_minimum" 
                  type="number"
                  defaultValue={editingProduct?.stock_minimum || 0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input 
                id="tags" 
                name="tags" 
                placeholder="produto, categoria, tipo..."
                defaultValue={editingProduct?.tags?.join(', ') || ""}
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_service" 
                  name="is_service"
                  defaultChecked={editingProduct?.is_service || false}
                />
                <Label htmlFor="is_service">É um serviço</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  name="is_active"
                  defaultChecked={editingProduct?.is_active !== false}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? "Atualizar" : "Criar"} Produto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
