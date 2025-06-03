
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ImportRecord {
  id: string;
  import_type: string;
  file_name: string;
  status: string;
  imported_count: number;
  errors: any[];
  created_at: string;
}

export const useImports = () => {
  const { company } = useAuth();
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImports = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('imports')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImports(data || []);
    } catch (error) {
      console.error('Erro ao buscar importações:', error);
    } finally {
      setLoading(false);
    }
  };

  const processLeadsImport = async (file: File) => {
    if (!company?.id) return;

    setLoading(true);
    try {
      // Create import record
      const { data: importRecord, error: importError } = await supabase
        .from('imports')
        .insert({
          import_type: 'leads',
          file_name: file.name,
          status: 'processing',
          company_id: company.id
        })
        .select()
        .single();

      if (importError) throw importError;

      // Process CSV file
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim().toLowerCase());
      const dataRows = rows.slice(1).filter(row => row.length > 1);

      let importedCount = 0;
      const errors: any[] = [];

      for (const row of dataRows) {
        try {
          const leadData: any = {
            company_id: company.id,
            stage: 'Prospecting'
          };

          headers.forEach((header, index) => {
            const value = row[index]?.trim().replace(/"/g, '');
            switch (header) {
              case 'nome':
              case 'name':
                leadData.name = value;
                break;
              case 'email':
                leadData.email = value;
                break;
              case 'telefone':
              case 'phone':
                leadData.phone = value;
                break;
              case 'valor':
              case 'value':
                leadData.value = parseFloat(value) || 0;
                break;
              case 'origem':
              case 'source':
                leadData.source = value;
                break;
              case 'prioridade':
              case 'priority':
                leadData.priority = value;
                break;
              case 'status':
              case 'stage':
                leadData.stage = value;
                break;
              case 'descricao':
              case 'description':
                leadData.description = value;
                break;
            }
          });

          if (leadData.name) {
            const { error } = await supabase
              .from('sales_leads')
              .insert(leadData);

            if (error) throw error;
            importedCount++;
          }
        } catch (error) {
          errors.push({ row: row.join(','), error: String(error) });
        }
      }

      // Update import record
      await supabase
        .from('imports')
        .update({
          status: 'completed',
          imported_count: importedCount,
          errors
        })
        .eq('id', importRecord.id);

      toast.success(`Importação concluída! ${importedCount} leads importados.`);
      await fetchImports();
    } catch (error) {
      console.error('Erro na importação:', error);
      toast.error('Erro durante a importação');
    } finally {
      setLoading(false);
    }
  };

  const processDocumentsImport = async (files: FileList) => {
    if (!company?.id) return;

    setLoading(true);
    try {
      let importedCount = 0;
      const errors: any[] = [];

      for (const file of Array.from(files)) {
        try {
          const content = await file.text();
          
          const { error } = await supabase
            .from('documents')
            .insert({
              title: file.name,
              content,
              file_type: file.type.includes('text') ? 'document' : 'file',
              size_kb: Math.round(file.size / 1024),
              company_id: company.id
            });

          if (error) throw error;
          importedCount++;
        } catch (error) {
          errors.push({ file: file.name, error: String(error) });
        }
      }

      // Create import record
      await supabase
        .from('imports')
        .insert({
          import_type: 'documents',
          file_name: `${files.length} arquivos`,
          status: 'completed',
          imported_count: importedCount,
          errors,
          company_id: company.id
        });

      toast.success(`${importedCount} documentos importados com sucesso!`);
      await fetchImports();
    } catch (error) {
      console.error('Erro na importação de documentos:', error);
      toast.error('Erro durante a importação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImports();
  }, [company]);

  return {
    imports,
    loading,
    processLeadsImport,
    processDocumentsImport,
    refetch: fetchImports
  };
};
