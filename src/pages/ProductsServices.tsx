
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Package, Settings, BarChart3, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProductsServices = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockProducts = [
    {
      id: 1,
      name: "CRM Premium",
      type: "Serviço",
      price: 297,
      category: "Software",
      status: "Ativo",
      stock: null,
      description: "Sistema completo de gestão de relacionamento",
      sales: 45
    },
    {
      id: 2,
      name: "Consultoria Estratégica",
      type: "Serviço",
      price: 2500,
      category: "Consultoria",
      status: "Ativo",
      stock: null,
      description: "Consultoria especializada em vendas",
      sales: 12
    },
    {
      id: 3,
      name: "Template Marketing",
      type: "Produto",
      price: 97,
      category: "Digital",
      status: "Ativo",
      stock: 100,
      description: "Pack com templates para campanhas",
      sales: 78
    }
  ];

  const mockCategories = [
    { name: "Software", count: 5, revenue: "R$ 45.000" },
    { name: "Consultoria", count: 3, revenue: "R$ 30.000" },
    { name: "Digital", count: 8, revenue: "R$ 12.000" },
    { name: "Treinamento", count: 2, revenue: "R$ 8.000" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Inativo': return 'bg-gray-100 text-gray-800';
      case 'Rascunho': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Produtos & Serviços</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos e serviços</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProducts.length}</div>
            <p className="text-xs text-muted-foreground">+2 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProducts.filter(p => p.status === 'Ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">100% disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProducts.reduce((acc, p) => acc + p.sales, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 95.000</div>
            <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lista de Produtos</CardTitle>
                  <CardDescription>Gerencie seus produtos e serviços</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produtos..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="outline">{product.type}</Badge>
                          <Badge variant="outline">{product.category}</Badge>
                          {product.stock && (
                            <span className="text-xs text-muted-foreground">
                              Estoque: {product.stock}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div>
                        <div className="font-bold">R$ {product.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{product.sales} vendas</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Organize seus produtos por categorias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockCategories.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6 text-center">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.count} produtos
                      </p>
                      <p className="font-bold text-primary">{category.revenue}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análises de Produtos</CardTitle>
              <CardDescription>Insights sobre performance dos produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Gráficos de análise em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsServices;
