
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AutomationRule } from "./types";

export async function saveAutomationRules(userId: string, companyId: string, rules: AutomationRule[]): Promise<boolean> {
  try {
    // Check if we have a record for this user/company
    const { data: existing } = await supabase
      .from("automation_rules")
      .select("id")
      .eq("user_id", userId)
      .eq("company_id", companyId)
      .single();
    
    if (existing) {
      const { error } = await supabase
        .from("automation_rules")
        .update({
          rules: rules,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id);
        
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("automation_rules")
        .insert({
          user_id: userId,
          company_id: companyId,
          rules: rules
        });
        
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to save automation rules:", error);
    toast.error("Não foi possível salvar as regras de automação");
    return false;
  }
}
