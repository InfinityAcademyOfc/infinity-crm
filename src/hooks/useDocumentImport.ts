
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { importService } from '@/services/importService';
import { toast } from 'sonner';

export const useDocumentImport = () => {
  const { company } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocuments = async (files: FileList | File[]): Promise<number> => {
    if (!company?.id) {
      toast.error('Empresa não identificada');
      return 0;
    }

    setIsUploading(true);
    let successful = 0;

    try {
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        const success = await importService.uploadDocument(file, company.id);
        if (success) {
          successful++;
        }
      }

      if (successful > 0) {
        toast.success(`${successful} documento(s) importado(s) com sucesso!`);
      }

      if (successful < fileArray.length) {
        const failed = fileArray.length - successful;
        toast.error(`${failed} documento(s) falharam na importação`);
      }

    } catch (error) {
      toast.error('Erro durante o upload de documentos');
      console.error('Document upload error:', error);
    } finally {
      setIsUploading(false);
    }

    return successful;
  };

  return {
    isUploading,
    uploadDocuments
  };
};
