
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProductCRUD } from "@/components/products/ProductCRUD";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Package } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/api/productService";
import { toast } from "sonner";

const ProductsServicesEnhanced = () => {
  const { user, companyProfile } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

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

  const handleCreateProduct = async (productData: any) => {
    try {
      await productService.createProduct({
        ...productData,
        company_id: companyId
      });
      queryClient.invalidateQueries({ queryKey: ['products', companyId] });
      toast.success("Produto criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar produto");
    }
  };

  const handleUpdateProduct = async (productId: string, updates: any) => {
    try {
      await productService.updateProduct(productId, updates);
      queryClient.invalidateQueries({ queryKey: ['products', companyId] });
      toast.success("Produto atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar produto");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      queryClient.invalidateQueries({ queryKey: ['products', companyId] });
      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir produto");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
        <Button onClick={() => setNewProductOpen(true)}>
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Package className="h-5 w-5 text-primary" />
                <Badge variant="secondary">
                  {product.category || "Sem categoria"}
                </Badge>
              </div>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  {product.price && (
                    <p className="font-semibold text-primary">
                      {formatPrice(product.price)}
                    </p>
                  )}
                  {product.stock !== null && product.stock !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      Estoque: {product.stock}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditProduct(product)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
          </p>
        </div>
      )}

      <ProductCRUD companyId={companyId} />
    </div>
  );
};

export default ProductsServicesEnhanced;
