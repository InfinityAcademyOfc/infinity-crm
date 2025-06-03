
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ImportRecord {
  id: string;
  import_type: string;
  file_name: string;
  file_url?: string;
  status: string;
  imported_count: number;
  errors: any[];
  company_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useImports = () => {
  const { company } = useAuth();
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImports = async () => {
    if (!company?.id) return;

    setLoading(true);
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
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('imports')
        .insert([{
          import_type: 'leads',
          file_name: file.name,
          status: 'processing',
          company_id: company.id,
          imported_count: 0,
          errors: []
        }])
        .select()
        .single();

      if (error) throw error;
      
      setImports(prev => [data, ...prev]);
      toast.success('Importação de leads iniciada!');
      return data;
    } catch (error) {
      console.error('Erro ao processar importação:', error);
      toast.error('Erro ao processar importação');
      throw error;
    }
  };

  const processClientsImport = async (file: File) => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('imports')
        .insert([{
          import_type: 'clients',
          file_name: file.name,
          status: 'processing',
          company_id: company.id,
          imported_count: 0,
          errors: []
        }])
        .select()
        .single();

      if (error) throw error;
      
      setImports(prev => [data, ...prev]);
      toast.success('Importação de clientes iniciada!');
      return data;
    } catch (error) {
      console.error('Erro ao processar importação:', error);
      toast.error('Erro ao processar importação');
      throw error;
    }
  };

  const processDocumentsImport = async (files: FileList) => {
    if (!company?.id) return;

    try {
      const promises = Array.from(files).map(async (file) => {
        const { data, error } = await supabase
          .from('imports')
          .insert([{
            import_type: 'documents',
            file_name: file.name,
            status: 'processing',
            company_id: company.id,
            imported_count: 0,
            errors: []
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      const results = await Promise.all(promises);
      setImports(prev => [...results, ...prev]);
      toast.success('Importação de documentos iniciada!');
      return results;
    } catch (error) {
      console.error('Erro ao processar importação:', error);
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
    processClientsImport,
    processDocumentsImport,
    refetch: fetchImports
  };
};
