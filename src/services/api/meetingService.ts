
import { supabase } from "@/integrations/supabase/client";
import { Meeting } from "@/types/meeting";
import { toast } from "sonner";

export const meetingService = {
  async getMeetings(companyId: string): Promise<Meeting[]> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar reuniões:", error);
      toast.error("Erro ao carregar reuniões");
      return [];
    }
  },

  async getMeetingById(id: string): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar reunião:", error);
      toast.error("Erro ao carregar dados da reunião");
      return null;
    }
  },

  async createMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .insert(meeting)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Reunião agendada com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
      toast.error("Erro ao agendar reunião");
      return null;
    }
  },

  async updateMeeting(id: string, meeting: Partial<Meeting>): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .update(meeting)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Reunião atualizada com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar reunião:", error);
      toast.error("Erro ao atualizar reunião");
      return null;
    }
  },

  async deleteMeeting(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Reunião removida com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir reunião:", error);
      toast.error("Erro ao remover reunião");
      return false;
    }
  }
};
