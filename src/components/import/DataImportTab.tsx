
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";
import DropZone from "./DropZone";

const DataImportTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Importar Dados</CardTitle>
          <CardDescription>
            Importe dados adicionais para o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DropZone
            icon={<FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />}
            title="Arraste planilhas ou"
            buttonText="Selecionar Arquivo"
            supportedFormats="Suporta planilhas (.xls, .xlsx, .csv)"
            onClick={() => console.log("Select file")}
          />
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Opções de Importação</CardTitle>
          <CardDescription>
            Configure as opções de importação de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              1. Selecione um arquivo para importar
            </p>
            <p className="text-sm">
              2. Configure as opções de importação
            </p>
            <p className="text-sm">
              3. Verifique a prévia da importação
            </p>
            <p className="text-sm">
              4. Confirme a importação dos dados
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImportTab;
