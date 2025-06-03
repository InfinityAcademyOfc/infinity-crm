
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { ImportRecord } from '@/hooks/useImports';

interface ImportHistoryTableProps {
  imports: ImportRecord[];
}

const ImportHistoryTable: React.FC<ImportHistoryTableProps> = ({ imports }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Importações</CardTitle>
      </CardHeader>
      <CardContent>
        {imports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma importação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {imports.map((importRecord) => (
              <div
                key={importRecord.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(importRecord.status)}
                  <div>
                    <h4 className="font-medium">{importRecord.file_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{importRecord.import_type}</span>
                      <span>•</span>
                      <span>{new Date(importRecord.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="font-medium">{importRecord.imported_count} importados</div>
                    {importRecord.errors.length > 0 && (
                      <div className="text-red-600">{importRecord.errors.length} erros</div>
                    )}
                  </div>
                  <Badge className={getStatusColor(importRecord.status)}>
                    {importRecord.status === 'completed' ? 'Concluído' :
                     importRecord.status === 'failed' ? 'Erro' :
                     importRecord.status === 'processing' ? 'Processando' : importRecord.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportHistoryTable;
