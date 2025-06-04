
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const LeadImport = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importação de Leads</h1>
        <p className="text-muted-foreground">
          Importe leads de arquivos CSV ou Excel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Arquivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Arraste e solte seu arquivo aqui</p>
            <p className="text-sm text-muted-foreground mb-4">
              Suporte para arquivos CSV e Excel (até 10MB)
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
              Selecionar Arquivo
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadImport;
