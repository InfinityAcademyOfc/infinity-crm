
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Database } from 'lucide-react';
import { useImports } from '@/hooks/useImports';
import LeadImportTab from '@/components/import/LeadImportTab';
import DocumentsImportTab from '@/components/import/DocumentsImportTab';
import DataImportTab from '@/components/import/DataImportTab';
import ImportHistoryTable from '@/components/import/ImportHistoryTable';

const Import = () => {
  const { imports, processLeadsImport, processDocumentsImport } = useImports();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const downloadLeadsTemplate = () => {
    const headers = ['nome', 'email', 'telefone', 'valor', 'origem', 'prioridade', 'status', 'descricao'];
    const sampleData = [
      ['João Silva', 'joao@email.com', '11999999999', '5000', 'Website', 'high', 'new', 'Lead interessado em nossos serviços'],
      ['Maria Santos', 'maria@email.com', '11888888888', '3000', 'Facebook', 'medium', 'contacted', 'Solicitou orçamento'],
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_leads.csv';
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleLeadsImport = async () => {
    if (!selectedFile) return;
    
    try {
      await processLeadsImport(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.error('Erro na importação:', error);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Importação de Dados" 
        description="Importe leads, documentos e outros dados para o sistema"
      />
      
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Upload size={16} />
            Leads
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText size={16} />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database size={16} />
            Dados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <LeadImportTab
            onDownloadTemplate={downloadLeadsTemplate}
            onFileUpload={handleFileUpload}
            onImport={handleLeadsImport}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsImportTab />
        </TabsContent>
        
        <TabsContent value="data">
          <DataImportTab />
        </TabsContent>
      </Tabs>

      <ImportHistoryTable imports={imports} />
    </div>
  );
};

export default Import;
