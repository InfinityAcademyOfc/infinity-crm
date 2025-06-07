
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, X } from 'lucide-react';
import { useDocumentImport } from '@/hooks/useDocumentImport';

const DocumentDropZone: React.FC = () => {
  const { isUploading, uploadDocuments } = useDocumentImport();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.includes('document') || 
      file.type.includes('pdf') || 
      file.type.includes('text') ||
      file.type.includes('spreadsheet') ||
      file.name.match(/\.(doc|docx|pdf|txt|xls|xlsx|csv)$/i)
    );
    
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length > 0) {
      await uploadDocuments(selectedFiles);
      setSelectedFiles([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Documentos</CardTitle>
        <CardDescription>
          Arraste e solte ou selecione documentos para importar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-sm">
              Arraste documentos aqui ou{' '}
              <label className="text-primary cursor-pointer hover:underline">
                selecione arquivos
                <input
                  type="file"
                  multiple
                  accept=".doc,.docx,.pdf,.txt,.xls,.xlsx,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground">
              Suporta: DOC, DOCX, PDF, TXT, XLS, XLSX, CSV
            </p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Arquivos Selecionados:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={uploadFiles}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Enviando...' : `Enviar ${selectedFiles.length} Arquivo(s)`}
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Enviando documentos...</span>
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentDropZone;
