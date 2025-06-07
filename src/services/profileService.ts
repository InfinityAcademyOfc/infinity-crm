
import { supabase } from "@/integrations/supabase/client";
import { Profile, CompanyProfile, CompanySettings } from "@/types/profile";
import { toast } from "sonner";

export const profileService = {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
      return null;
    }
  },

  // Company Profile operations
  async getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles_companies')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar perfil da empresa:", error);
      return null;
    }
  },

  async updateCompanyProfile(userId: string, updates: Partial<CompanyProfile>): Promise<CompanyProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles_companies')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      toast.success("Perfil da empresa atualizado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar perfil da empresa:", error);
      toast.error("Erro ao atualizar perfil da empresa");
      return null;
    }
  },

  // Avatar operations
  async uploadAvatar(file: File, userId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    }
  },

  async removeAvatar(avatarUrl: string): Promise<boolean> {
    try {
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts.slice(-2).join('/'); // userId/filename.ext

      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Erro ao remover avatar:", error);
      return false;
    }
  },

  // Company Settings operations
  async getCompanySettings(companyId: string): Promise<CompanySettings | null> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar configurações da empresa:", error);
      return null;
    }
  },

  async updateCompanySettings(companyId: string, settings: any): Promise<CompanySettings | null> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .upsert({
          company_id: companyId,
          settings: settings
        })
        .select()
        .single();

      if (error) throw error;
      toast.success("Configurações atualizadas com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações");
      return null;
    }
  },

  // Company team operations
  async getCompanyTeam(companyId: string): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar equipe da empresa:", error);
      return [];
    }
  }
};
