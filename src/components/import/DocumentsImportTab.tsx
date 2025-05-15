
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import ImportDocumentDialog from "@/components/document/ImportDocumentDialog";

const DocumentsImportTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Importar Documentos</CardTitle>
          <CardDescription>
            Importe documentos para o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-base font-medium mb-2">Arraste documentos ou</h3>
            <ImportDocumentDialog />
            <p className="text-xs text-muted-foreground mt-4">
              Suporta documentos (.doc, .docx, .pdf, .txt) e planilhas (.xls, .xlsx, .csv)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Documentos Recentes</CardTitle>
          <CardDescription>
            Documentos importados recentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground py-6">
              Não há documentos importados recentemente
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsImportTab;
