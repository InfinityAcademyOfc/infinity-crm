
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealProducts } from '@/hooks/useRealProducts';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProductsServices = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { products, loading, createProduct, updateProduct, deleteProduct } = useRealProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  if (authLoading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!user || !company) {
    return <LoadingPage message="Acesso não autorizado" />;
  }

  const handleCreateSampleProduct = async () => {
    try {
      await createProduct({
        name: 'Produto de Exemplo',
        description: 'Descrição do produto ou serviço oferecido',
        price: 99.90,
        category: 'Serviços',
        stock: 10
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Produto removido",
        description: "O produto foi removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sem estoque', color: 'bg-red-500' };
    if (stock <= 5) return { label: 'Estoque baixo', color: 'bg-yellow-500' };
    return { label: 'Em estoque', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader 
        title="Produtos e Serviços" 
        description="Gerencie seu catálogo de produtos e serviços"
        actions={
          <>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10 focus-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleCreateSampleProduct}
              className="hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece adicionando produtos ou serviços ao seu catálogo'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={handleCreateSampleProduct}
                className="hover-scale transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const stockStatus = getStockStatus(product.stock || 0);
            
            return (
              <Card 
                key={product.id} 
                className="hover-lift transition-all duration-200 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="outline" className="mt-2">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      R$ {Number(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stockStatus.color}`} />
                      <span className="text-xs text-muted-foreground">
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Estoque: {product.stock || 0} unidades
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsServices;
