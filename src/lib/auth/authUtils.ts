
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { registerUser, RegisterUserPayload, RegisterUserResult } from "../registerUser";

// Função para fazer login
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
};

// Função para cadastrar novo usuário
export const registerUserWithAuth = async (
  email: string,
  password: string,
  name: string,
  isCompany: boolean
): Promise<RegisterUserResult> => {
  return await registerUser({
    email,
    password,
    name,
    isCompany
  });
};

// Função para logout
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  toast.info("Sessão encerrada com sucesso");
  return true;
};
