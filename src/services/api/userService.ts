
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { toast } from "sonner";

export const userService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      toast.error("Erro ao carregar dados do usuário");
      return null;
    }
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
      return null;
    }
  },

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile | null> {
    try {
      // Update both avatar and avatar_url fields for compatibility
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar: avatarUrl, avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Avatar atualizado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar avatar:", error);
      toast.error("Erro ao atualizar avatar");
      return null;
    }
  },

  async getCompanyUsers(companyId: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar usuários da empresa:", error);
      toast.error("Erro ao carregar usuários");
      return [];
    }
  }
};
