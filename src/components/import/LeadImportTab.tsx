
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Download, FileText } from 'lucide-react';

interface LeadImportTabProps {
  onDownloadTemplate: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
}

const LeadImportTab = ({ onDownloadTemplate, onFileUpload, onImport }: LeadImportTabProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    onFileUpload(e);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Como importar seus leads:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Baixe o template CSV clicando no botão abaixo</li>
              <li>Preencha o arquivo com os dados dos seus leads</li>
              <li>Faça o upload do arquivo preenchido</li>
              <li>Clique em "Importar" para processar os dados</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={onDownloadTemplate} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Baixar Template CSV
            </Button>
            
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              </div>
              <Button onClick={onImport} size="sm">
                Importar
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p><strong>Colunas suportadas:</strong> nome, email, telefone, valor, origem, prioridade, status, descricao</p>
            <p><strong>Formatos aceitos:</strong> CSV (separado por vírgula)</p>
            <p><strong>Tamanho máximo:</strong> 10MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadImportTab;
