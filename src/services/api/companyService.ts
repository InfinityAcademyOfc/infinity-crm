
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { toast } from "sonner";

export const companyService = {
  async getCompanyById(id: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      toast.error("Erro ao carregar dados da empresa");
      return null;
    }
  },

  async updateCompany(id: string, company: Partial<Company>): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(company)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Dados da empresa atualizados com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      toast.error("Erro ao atualizar dados da empresa");
      return null;
    }
  },

  async getUserCompanies(userId: string): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', userId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar empresas do usuário:", error);
      toast.error("Erro ao carregar empresas");
      return [];
    }
  }
};
