
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload } from 'lucide-react';
import { useImports } from '@/hooks/useImports';

const DocumentsImportTab = () => {
  const { processDocumentsImport } = useImports();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    setUploading(true);
    try {
      await processDocumentsImport(selectedFiles);
      setSelectedFiles(null);
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importar Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Formatos suportados:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
              <li>Documentos de texto (.txt, .md)</li>
              <li>Documentos PDF (.pdf)</li>
              <li>Planilhas (.csv, .xlsx)</li>
              <li>Imagens (.jpg, .png, .gif)</li>
            </ul>
          </div>

          <div>
            <Input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Arquivos selecionados ({selectedFiles.length}):</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                    <span className="text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                  </div>
                ))}
              </div>
              <Button onClick={handleUpload} disabled={uploading} className="w-full">
                {uploading ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Enviar Documentos
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsImportTab;
