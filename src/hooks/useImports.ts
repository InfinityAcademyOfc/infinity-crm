
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ImportRecord {
  id: string;
  import_type: 'leads' | 'documents';
  file_name: string;
  file_url: string | null;
  status: 'processing' | 'completed' | 'failed';
  imported_count: number;
  errors: any[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useImports = () => {
  const { user, company } = useAuth();
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
      toast.error('Erro ao carregar importações');
    } finally {
      setLoading(false);
    }
  };

  const processLeadsImport = async (file: File) => {
    if (!company?.id || !user?.id) return;

    try {
      // Criar registro de importação
      const { data: importRecord, error: importError } = await supabase
        .from('imports')
        .insert([{
          company_id: company.id,
          import_type: 'leads',
          file_name: file.name,
          status: 'processing',
          created_by: user.id
        }])
        .select()
        .single();

      if (importError) throw importError;

      setImports(prev => [importRecord, ...prev]);
      toast.loading('Processando importação de leads...');

      // Processar CSV
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      let importedCount = 0;
      const errors: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        try {
          const values = lines[i].split(',');
          const leadData: any = {
            company_id: company.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // Mapear colunas
          headers.forEach((header, index) => {
            const value = values[index]?.trim().replace(/"/g, '');
            if (!value) return;

            switch (header) {
              case 'nome':
              case 'name':
                leadData.name = value;
                break;
              case 'titulo':
              case 'title':
                leadData.title = value;
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
                leadData.value = parseFloat(value) || null;
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
                leadData.status = value;
                break;
              case 'descricao':
              case 'description':
                leadData.description = value;
                break;
              default:
                // Adicionar dados extras na descrição
                leadData.description = (leadData.description || '') + `\n${header}: ${value}`;
            }
          });

          // Validações obrigatórias
          if (!leadData.name) {
            errors.push({ line: i + 1, error: 'Nome é obrigatório' });
            continue;
          }

          if (!leadData.title) {
            leadData.title = `Lead ${leadData.name}`;
          }

          leadData.priority = leadData.priority || 'medium';
          leadData.status = leadData.status || 'new';

          // Inserir lead
          const { error: leadError } = await supabase
            .from('leads')
            .insert([leadData]);

          if (leadError) {
            errors.push({ line: i + 1, error: leadError.message });
          } else {
            importedCount++;
          }
        } catch (error) {
          errors.push({ line: i + 1, error: error.message });
        }
      }

      // Atualizar registro de importação
      const { data: updatedImport, error: updateError } = await supabase
        .from('imports')
        .update({
          status: errors.length > 0 ? 'failed' : 'completed',
          imported_count: importedCount,
          errors
        })
        .eq('id', importRecord.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setImports(prev => prev.map(imp => imp.id === importRecord.id ? updatedImport : imp));
      
      toast.dismiss();
      if (importedCount > 0) {
        toast.success(`${importedCount} leads importados com sucesso!`);
      }
      if (errors.length > 0) {
        toast.warning(`${errors.length} erros encontrados na importação`);
      }

      return updatedImport;
    } catch (error) {
      console.error('Erro ao processar importação:', error);
      toast.dismiss();
      toast.error('Erro ao processar importação');
      throw error;
    }
  };

  const processDocumentsImport = async (files: FileList) => {
    if (!company?.id || !user?.id) return;

    try {
      const fileArray = Array.from(files);
      
      // Criar registro de importação
      const { data: importRecord, error: importError } = await supabase
        .from('imports')
        .insert([{
          company_id: company.id,
          import_type: 'documents',
          file_name: `${fileArray.length} arquivos`,
          status: 'processing',
          created_by: user.id
        }])
        .select()
        .single();

      if (importError) throw importError;

      setImports(prev => [importRecord, ...prev]);
      toast.loading('Processando importação de documentos...');

      let importedCount = 0;
      const errors: any[] = [];

      for (const file of fileArray) {
        try {
          const content = await file.text();
          
          const { error: docError } = await supabase
            .from('documents')
            .insert([{
              company_id: company.id,
              title: file.name,
              content,
              folder_path: '/importados',
              file_type: file.type || 'document',
              size_kb: Math.round(file.size / 1024),
              created_by: user.id,
              last_edited_by: user.id
            }]);

          if (docError) {
            errors.push({ file: file.name, error: docError.message });
          } else {
            importedCount++;
          }
        } catch (error) {
          errors.push({ file: file.name, error: error.message });
        }
      }

      // Atualizar registro de importação
      const { data: updatedImport, error: updateError } = await supabase
        .from('imports')
        .update({
          status: errors.length > 0 ? 'failed' : 'completed',
          imported_count: importedCount,
          errors
        })
        .eq('id', importRecord.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setImports(prev => prev.map(imp => imp.id === importRecord.id ? updatedImport : imp));
      
      toast.dismiss();
      if (importedCount > 0) {
        toast.success(`${importedCount} documentos importados com sucesso!`);
      }
      if (errors.length > 0) {
        toast.warning(`${errors.length} erros encontrados na importação`);
      }

      return updatedImport;
    } catch (error) {
      console.error('Erro ao processar importação:', error);
      toast.dismiss();
      toast.error('Erro ao processar importação');
      throw error;
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
