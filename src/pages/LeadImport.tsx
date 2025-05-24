
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const LeadImport = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const mockImportHistory = [
    {
      id: 1,
      fileName: "leads_janeiro_2024.csv",
      date: "2024-01-15",
      status: "Sucesso",
      totalRecords: 1250,
      successfulImports: 1200,
      errors: 50,
      source: "Facebook Ads"
    },
    {
      id: 2,
      fileName: "prospects_google.xlsx",
      date: "2024-01-14",
      status: "Sucesso",
      totalRecords: 850,
      successfulImports: 850,
      errors: 0,
      source: "Google Ads"
    },
    {
      id: 3,
      fileName: "lista_webinar.csv",
      date: "2024-01-13",
      status: "Erro",
      totalRecords: 500,
      successfulImports: 0,
      errors: 500,
      source: "Webinar"
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simular upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sucesso': return 'bg-green-100 text-green-800';
      case 'Erro': return 'bg-red-100 text-red-800';
      case 'Processando': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sucesso': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Erro': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Importação de Leads</h1>
          <p className="text-muted-foreground">Importe leads de diferentes fontes</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Baixar Template
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Importado</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.600</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">86%</div>
            <p className="text-xs text-muted-foreground">2.240 de 2.600 leads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads com Erro</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">360</div>
            <p className="text-xs text-muted-foreground">14% com problemas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Importações</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Nova Importação</CardTitle>
          <CardDescription>
            Faça upload de arquivos CSV ou Excel com seus leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isUploading && uploadStatus === 'idle' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Arraste e solte seu arquivo aqui</h3>
                <p className="text-gray-500 mb-4">ou clique para selecionar</p>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button asChild>
                    <span>Selecionar Arquivo</span>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceitos: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
            )}

            {isUploading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fazendo upload...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Upload concluído!</p>
                    <p className="text-sm text-green-600">Arquivo processado com sucesso</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUploadStatus('idle')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Campos Obrigatórios</h4>
                <ul className="text-blue-600 space-y-1">
                  <li>• Nome</li>
                  <li>• Email ou Telefone</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">Campos Opcionais</h4>
                <ul className="text-green-600 space-y-1">
                  <li>• Empresa</li>
                  <li>• Cargo</li>
                  <li>• Origem</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-1">Dicas</h4>
                <ul className="text-yellow-600 space-y-1">
                  <li>• Máximo 5.000 linhas</li>
                  <li>• Use o template padrão</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Importações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Importações</CardTitle>
          <CardDescription>Acompanhe suas importações recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockImportHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-medium">{item.fileName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.date} • Origem: {item.source}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    <div>Total: {item.totalRecords}</div>
                    <div className="flex gap-4">
                      <span className="text-green-600">
                        ✓ {item.successfulImports}
                      </span>
                      {item.errors > 0 && (
                        <span className="text-red-600">
                          ✗ {item.errors}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadImport;
