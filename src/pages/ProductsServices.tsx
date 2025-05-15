import { useState } from "react";
import { Plus, Search, Download, Tag, Package, MoreHorizontal, Pencil, Trash2, ReceiptText, ArrowUpDown } from "lucide-react";
import { SectionHeader, ActionButton } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { mockProducts } from "@/data/mockData";
import { formatCurrency } from "@/lib/formatters";
const ProductsServices = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<typeof mockProducts[0] | null>(null);
  const {
    toast
  } = useToast();
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const recurrence = formData.get("recurrence") as string;
    const description = formData.get("description") as string;
    if (!name || !category || isNaN(price) || !recurrence) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    const newProduct = {
      id: (products.length + 1).toString(),
      name,
      category,
      price,
      recurrence,
      stock: category === "Produto" ? 0 : null,
      description
    };
    setProducts([...products, newProduct]);
    setNewProductOpen(false);
    form.reset();
    toast({
      title: "Produto/Serviço adicionado",
      description: `${name} foi adicionado com sucesso`
    });
  };
  const handleEditProduct = (product: typeof mockProducts[0]) => {
    setActiveProduct(product);
    setEditProductOpen(true);
  };
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const recurrence = formData.get("recurrence") as string;
    const description = formData.get("description") as string;
    const updatedProduct = {
      ...activeProduct,
      name,
      category,
      price,
      recurrence,
      description,
      stock: category === "Produto" ? activeProduct.stock || 0 : null
    };
    setProducts(products.map(p => p.id === activeProduct.id ? updatedProduct : p));
    setEditProductOpen(false);
    toast({
      title: "Produto/Serviço atualizado",
      description: `${name} foi atualizado com sucesso`
    });
  };
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Produto/Serviço removido",
      description: "O item foi removido com sucesso"
    });
  };
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="space-y-6">
      <SectionHeader title="Produtos e Serviços" description="Gerencie seu catálogo de produtos e serviços" actions={<>
            <div className="relative md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar produtos..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <ActionButton icon={<Download size={16} />} label="Exportar" onClick={() => {
        toast({
          title: "Exportação iniciada",
          description: "O arquivo será baixado em instantes"
        });
      }} variant="outline" />
            <ActionButton icon={<Plus size={16} />} label="Novo Produto/Serviço" onClick={() => setNewProductOpen(true)} />
          </>} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <span>Nome</span>
                  <ArrowUpDown size={14} className="ml-2" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <span>Categoria</span>
                  <ArrowUpDown size={14} className="ml-2" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                  <span>Preço</span>
                  <ArrowUpDown size={14} className="ml-2" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Recorrência</TableHead>
              <TableHead className="hidden md:table-cell">Estoque</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhum produto ou serviço encontrado
                </TableCell>
              </TableRow> : filteredProducts.map(product => <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${product.category === "Software" ? "bg-blue-100" : product.category === "Serviço" ? "bg-purple-100" : "bg-green-100"}`}>
                        <Package size={16} className={`${product.category === "Software" ? "text-blue-600" : product.category === "Serviço" ? "text-purple-600" : "text-green-600"}`} />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-transparent">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(product.price)}
                    {product.recurrence !== "one-time" && <span className="text-xs text-muted-foreground ml-1">
                        /{product.recurrence === "monthly" ? "mês" : product.recurrence === "yearly" ? "ano" : ""}
                      </span>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.recurrence === "one-time" ? "Pagamento Único" : product.recurrence === "monthly" ? "Mensal" : "Anual"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.stock !== null ? product.stock : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditProduct(product)} className="gap-2 cursor-pointer">
                          <Pencil size={14} />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({
                    title: "Ação indisponível",
                    description: "Esta funcionalidade será implementada em breve"
                  })} className="gap-2 cursor-pointer">
                          <ReceiptText size={14} />
                          Gerar Proposta
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600 focus:text-red-600 gap-2 cursor-pointer">
                          <Trash2 size={14} />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>)}
          </TableBody>
        </Table>
      </div>
      
      {/* New Product Dialog */}
      <Dialog open={newProductOpen} onOpenChange={setNewProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Produto/Serviço</DialogTitle>
            <DialogDescription>
              Preencha as informações para adicionar um novo produto ou serviço.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome*</Label>
                <Input id="name" name="name" placeholder="Ex: Sistema ERP Completo" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria*</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Serviço">Serviço</SelectItem>
                      <SelectItem value="Produto">Produto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço (R$)*</Label>
                  <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="0,00" required />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="recurrence">Recorrência*</Label>
                <Select name="recurrence" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">Pagamento Único</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" placeholder="Descrição detalhada do produto ou serviço..." rows={3} />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewProductOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Produto/Serviço</DialogTitle>
            <DialogDescription>
              Atualize as informações do produto ou serviço.
            </DialogDescription>
          </DialogHeader>
          
          {activeProduct && <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nome*</Label>
                  <Input id="edit-name" name="name" defaultValue={activeProduct.name} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Categoria*</Label>
                    <Select name="category" defaultValue={activeProduct.category} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Serviço">Serviço</SelectItem>
                        <SelectItem value="Produto">Produto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Preço (R$)*</Label>
                    <Input id="edit-price" name="price" type="number" min="0" step="0.01" defaultValue={activeProduct.price} required />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-recurrence">Recorrência*</Label>
                  <Select name="recurrence" defaultValue={activeProduct.recurrence} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">Pagamento Único</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea id="edit-description" name="description" defaultValue={activeProduct.description} rows={3} />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditProductOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>}
        </DialogContent>
      </Dialog>
    </div>;
};
export default ProductsServices;