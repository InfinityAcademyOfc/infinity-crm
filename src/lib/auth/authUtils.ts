
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { registerUser } from "../registerUser";

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

export const registerUserWithAuth = async (
  email: string,
  password: string,
  name: string
) => {
  return await registerUser({
    email,
    password,
    name,
    isCompany: true
  });
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  toast.info("Sessão encerrada com sucesso");
  return true;
};
