
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database, Upload } from 'lucide-react';
import { toast } from 'sonner';

const DataImportTab = () => {
  const [importType, setImportType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!file || !importType) {
      toast.error('Selecione o tipo de dados e um arquivo');
      return;
    }

    setImporting(true);
    try {
      // Simulated import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Dados importados com sucesso!');
      setFile(null);
      setImportType('');
    } catch (error) {
      toast.error('Erro na importação');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Importar Dados Diversos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="data-type">Tipo de Dados</Label>
            <Select value={importType} onValueChange={setImportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de dados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clients">Clientes</SelectItem>
                <SelectItem value="products">Produtos</SelectItem>
                <SelectItem value="transactions">Transações Financeiras</SelectItem>
                <SelectItem value="tasks">Tarefas</SelectItem>
                <SelectItem value="meetings">Reuniões</SelectItem>
                <SelectItem value="contacts">Contatos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data-file">Arquivo de Dados</Label>
            <Input
              id="data-file"
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {file && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Arquivo selecionado:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={!file || !importType || importing}
            className="w-full"
          >
            {importing ? (
              <>Importando...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Dados
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Formatos aceitos:</strong> CSV, Excel (.xlsx), JSON</p>
            <p><strong>Tamanho máximo:</strong> 50MB</p>
            <p><strong>Nota:</strong> Certifique-se de que os dados estejam no formato correto antes da importação</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImportTab;
