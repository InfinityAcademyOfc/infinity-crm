
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { toast } from "sonner";

export const taskService = {
  async getTasks(companyId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao carregar tarefas");
      return [];
    }
  },

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar tarefa:", error);
      toast.error("Erro ao carregar dados da tarefa");
      return null;
    }
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Tarefa criada com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao criar tarefa");
      return null;
    }
  },

  async updateTask(id: string, task: Partial<Task>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Tarefa atualizada com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      toast.error("Erro ao atualizar tarefa");
      return null;
    }
  },

  async deleteTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Tarefa removida com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao remover tarefa");
      return false;
    }
  }
};
