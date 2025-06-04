
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, Plus } from 'lucide-react';

const ProductionManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Produção</h1>
          <p className="text-muted-foreground">
            Gerencie projetos e documentos da sua equipe
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhum projeto encontrado
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Comece criando seu primeiro projeto
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Criar Projeto
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionManagement;
