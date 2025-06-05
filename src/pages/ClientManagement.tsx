
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ClientManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie seus clientes e relacionamentos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhum cliente encontrado
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Comece adicionando seus primeiros clientes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagement;
