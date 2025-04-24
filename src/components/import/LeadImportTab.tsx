
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImportCard from "./ImportCard";

interface LeadImportTabProps {
  onDownloadTemplate: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
}

const LeadImportTab = ({ onDownloadTemplate, onFileUpload, onImport }: LeadImportTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ImportCard
        title="Importar Leads"
        description="Importe seus leads a partir de um arquivo CSV ou Excel"
        onDownloadTemplate={onDownloadTemplate}
        onFileUpload={onFileUpload}
        onImport={onImport}
      />

      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Mapeamento de Campos</CardTitle>
          <CardDescription>
            Mapeie os campos do seu arquivo com os campos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              1. Selecione um arquivo para importar
            </p>
            <p className="text-sm">
              2. Configure o mapeamento dos campos
            </p>
            <p className="text-sm">
              3. Verifique a prévia da importação
            </p>
            <p className="text-sm">
              4. Confirme a importação dos leads
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadImportTab;
