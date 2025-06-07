
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { importService, ImportedLead, ImportResult } from '@/services/importService';
import { toast } from 'sonner';

export const useLeadImport = () => {
  const { company } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<ImportedLead[]>([]);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        let leads: ImportedLead[] = [];
        
        if (file.name.endsWith('.csv')) {
          leads = importService.parseCSVToLeads(content);
        } else {
          toast.error('Formato de arquivo não suportado. Use CSV.');
          return;
        }

        setImportData(leads);
        toast.success(`${leads.length} leads processados. Revise antes de importar.`);
      } catch (error) {
        toast.error('Erro ao processar arquivo');
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
  };

  const executeImport = async (): Promise<ImportResult | null> => {
    if (!company?.id || importData.length === 0) {
      toast.error('Nenhum dado para importar');
      return null;
    }

    setIsImporting(true);
    try {
      const result = await importService.importLeadsToDatabase(importData, company.id);
      
      if (result.successful > 0) {
        toast.success(`${result.successful} leads importados com sucesso!`);
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} erros durante a importação`);
        console.error('Import errors:', result.errors);
      }

      return result;
    } catch (error) {
      toast.error('Erro durante a importação');
      console.error('Import error:', error);
      return null;
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = importService.generateLeadCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearImportData = () => {
    setImportData([]);
  };

  return {
    isImporting,
    importData,
    handleFileUpload,
    executeImport,
    downloadTemplate,
    clearImportData
  };
};
