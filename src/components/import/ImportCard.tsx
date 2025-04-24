
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import FileUploadField from "./FileUploadField";

interface ImportCardProps {
  title: string;
  description: string;
  onDownloadTemplate: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
}

const ImportCard = ({ 
  title, 
  description, 
  onDownloadTemplate, 
  onFileUpload, 
  onImport 
}: ImportCardProps) => {
  return (
    <Card className="bg-card dark:bg-gray-900/70 shadow-md border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadField
          id="file"
          label="Selecione um arquivo"
          acceptedFormats=".csv,.xlsx,.xls"
          formatDescription="Formatos suportados: CSV, Excel (.xlsx, .xls)"
          onChange={onFileUpload}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onDownloadTemplate} size="sm">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Modelo
        </Button>
        <Button size="sm" onClick={onImport}>
          <ArrowUpFromLine className="mr-2 h-4 w-4" />
          Importar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportCard;
