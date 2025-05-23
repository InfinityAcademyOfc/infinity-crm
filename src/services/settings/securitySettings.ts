
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export async function updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    
    toast.success("Senha atualizada com sucesso!");
    return true;
  } catch (error: any) {
    console.error("Error updating password:", error);
    toast.error(error.message || "Erro ao atualizar senha");
    return false;
  }
}
