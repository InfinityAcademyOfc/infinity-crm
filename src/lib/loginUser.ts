
import { supabase } from "@/integrations/supabase/client";
import { hydrateUser } from "./hydrateUser";
import { toast } from "sonner";

export async function loginUser(email: string, password: string) {
  // Validação para email
  if (!email || !email.trim()) {
    throw new Error("Email é obrigatório");
  }
  
  console.log("Iniciando login no Supabase para o usuário:", email);
  
  // Tentativa de login no Supabase
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Erro de login:", error.message);
    throw new Error(error.message);
  }

  console.log("Login bem-sucedido, dados do usuário:", data);
  
  return data;
}
