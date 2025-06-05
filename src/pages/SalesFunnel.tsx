
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const SalesFunnel = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Funil de Vendas</h1>
        <p className="text-muted-foreground">
          Acompanhe o progresso dos seus leads
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Pipeline de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Funil de vendas vazio
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione leads para começar a usar o funil
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesFunnel;
