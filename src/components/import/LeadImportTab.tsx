
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownToLine, Upload } from "lucide-react";
import { useLeadImport } from "@/hooks/useLeadImport";
import LeadImportPreview from "./LeadImportPreview";

const LeadImportTab = () => {
  const {
    isImporting,
    importData,
    handleFileUpload,
    executeImport,
    downloadTemplate,
    clearImportData
  } = useLeadImport();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Importar Leads</CardTitle>
          <CardDescription>
            Importe seus leads a partir de um arquivo CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file" className="text-sm">
              Selecione um arquivo CSV
            </Label>
            <Input
              id="file"
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="cursor-pointer"
              disabled={isImporting}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Formato suportado: CSV com cabeçalhos em português ou inglês
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={downloadTemplate} size="sm">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Template CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Campos Suportados</CardTitle>
          <CardDescription>
            Campos que podem ser importados do CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>• nome / name</div>
            <div>• email</div>
            <div>• telefone / phone</div>
            <div>• titulo / title</div>
            <div>• descricao / description</div>
            <div>• valor / value</div>
            <div>• origem / source</div>
            <div>• prioridade / priority</div>
            <div>• status</div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Campo "nome" é obrigatório. Outros campos são opcionais.
          </p>
        </CardContent>
      </Card>

      {importData.length > 0 && (
        <div className="lg:col-span-2">
          <LeadImportPreview
            leads={importData}
            isImporting={isImporting}
            onImport={executeImport}
            onClear={clearImportData}
          />
        </div>
      )}
    </div>
  );
};

export default LeadImportTab;
