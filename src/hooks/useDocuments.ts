
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Document {
  id: string;
  title: string;
  content: string | null;
  folder_path: string;
  file_type: string;
  size_kb: number | null;
  created_by: string | null;
  last_edited_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useDocuments = () => {
  const { user, company } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!company?.id) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('company_id', company.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (doc: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!company?.id || !user?.id) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([{
          ...doc,
          company_id: company.id,
          created_by: user.id,
          last_edited_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setDocuments(prev => [data, ...prev]);
      toast.success('Documento criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar documento:', error);
      toast.error('Erro ao criar documento');
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('documents')
        .update({
          ...updates,
          last_edited_by: user.id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDocuments(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast.error('Erro ao atualizar documento');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDocuments(prev => prev.filter(d => d.id !== id));
      toast.success('Documento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
      toast.error('Erro ao excluir documento');
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [company]);

  // Configurar tempo real para documentos
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel('documents-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents', filter: `company_id=eq.${company.id}` }, 
        (payload) => {
          console.log('Alteração em documento detectada:', payload);
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [company]);

  return {
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments
  };
};
