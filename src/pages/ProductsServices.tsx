
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const ProductsServices = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Produtos e Serviços</h1>
        <p className="text-muted-foreground">
          Gerencie seu catálogo de produtos e serviços
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catálogo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione produtos para começar seu catálogo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsServices;
