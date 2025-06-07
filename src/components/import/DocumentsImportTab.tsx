
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentDropZone from "./DocumentDropZone";

const DocumentsImportTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DocumentDropZone />

      <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Sobre a Importação</CardTitle>
          <CardDescription>
            Como funciona a importação de documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <strong>1. Formatos Suportados:</strong>
              <p className="text-muted-foreground">
                DOC, DOCX, PDF, TXT, XLS, XLSX, CSV
              </p>
            </div>
            
            <div>
              <strong>2. Organização:</strong>
              <p className="text-muted-foreground">
                Documentos são automaticamente organizados na pasta "Importados"
              </p>
            </div>
            
            <div>
              <strong>3. Armazenamento:</strong>
              <p className="text-muted-foreground">
                Arquivos são salvos de forma segura no Supabase Storage
              </p>
            </div>
            
            <div>
              <strong>4. Acesso:</strong>
              <p className="text-muted-foreground">
                Documentos ficam disponíveis no módulo Produção
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsImportTab;
