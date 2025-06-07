
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ImportedLead {
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  description?: string;
  value?: number;
  source?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: string;
}

export interface ImportResult {
  total: number;
  successful: number;
  errors: string[];
}

export const importService = {
  // Parse CSV content to leads
  parseCSVToLeads(csvContent: string): ImportedLead[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const leads: ImportedLead[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const lead: ImportedLead = { name: '' };

      headers.forEach((header, index) => {
        const value = values[index]?.replace(/"/g, '') || '';
        
        switch (header) {
          case 'nome':
          case 'name':
            lead.name = value;
            break;
          case 'email':
            lead.email = value;
            break;
          case 'telefone':
          case 'phone':
            lead.phone = value;
            break;
          case 'titulo':
          case 'title':
            lead.title = value;
            break;
          case 'descricao':
          case 'description':
            lead.description = value;
            break;
          case 'valor':
          case 'value':
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) lead.value = numValue;
            break;
          case 'origem':
          case 'source':
            lead.source = value;
            break;
          case 'prioridade':
          case 'priority':
            if (['low', 'medium', 'high'].includes(value.toLowerCase())) {
              lead.priority = value.toLowerCase() as 'low' | 'medium' | 'high';
            }
            break;
          case 'status':
            lead.status = value;
            break;
        }
      });

      if (lead.name) {
        leads.push(lead);
      }
    }

    return leads;
  },

  // Import leads to database
  async importLeadsToDatabase(leads: ImportedLead[], companyId: string): Promise<ImportResult> {
    const result: ImportResult = {
      total: leads.length,
      successful: 0,
      errors: []
    };

    for (const lead of leads) {
      try {
        const { error } = await supabase
          .from('sales_leads')
          .insert({
            name: lead.name,
            email: lead.email || null,
            phone: lead.phone || null,
            description: lead.description || null,
            value: lead.value || 0,
            source: lead.source || 'importação',
            priority: lead.priority || 'medium',
            stage: lead.status || 'prospecting',
            company_id: companyId
          });

        if (error) {
          result.errors.push(`Erro ao importar ${lead.name}: ${error.message}`);
        } else {
          result.successful++;
        }
      } catch (error) {
        result.errors.push(`Erro ao importar ${lead.name}: ${error}`);
      }
    }

    return result;
  },

  // Upload document to storage and save metadata
  async uploadDocument(file: File, companyId: string, folderId?: string): Promise<boolean> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `documents/${companyId}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return false;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save document metadata
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          file_type: fileExt || 'unknown',
          size_kb: Math.round(file.size / 1024),
          folder_path: folderId ? `/importados/${folderId}` : '/importados',
          content: publicUrl,
          company_id: companyId
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Document upload error:', error);
      return false;
    }
  },

  // Create CSV template for leads
  generateLeadCSVTemplate(): string {
    const headers = [
      'nome',
      'email', 
      'telefone',
      'titulo',
      'descricao',
      'valor',
      'origem',
      'prioridade',
      'status'
    ];

    const sampleData = [
      'João Silva',
      'joao@email.com',
      '(11) 99999-9999',
      'Lead Qualificado',
      'Interessado em nossos serviços',
      '5000',
      'website',
      'high',
      'prospecting'
    ];

    return [headers.join(','), sampleData.join(',')].join('\n');
  }
};
