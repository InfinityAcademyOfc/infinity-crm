
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  isCompany: boolean;
}

export async function registerUser({ name, email, password, isCompany }: RegisterUserPayload) {
  // Validação forte para senha
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.");
  }

  try {
    console.log("Iniciando registro de usuário:", email);

    // Etapa 1: criar usuário no Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (signUpError) {
      console.error("Erro no registro:", signUpError);
      throw new Error(signUpError.message);
    }

    if (!signUpData?.user) {
      console.error("Nenhum dado de usuário retornado");
      throw new Error("Erro inesperado ao registrar usuário.");
    }

    const userId = signUpData.user.id;
    console.log("Usuário criado com ID:", userId);

    // Etapa 2: login automático
    console.log("Realizando login automático após registro...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error("Erro no login após registro:", signInError);
      throw new Error("Erro ao autenticar após registro: " + signInError.message);
    }

    if (!signInData.session) {
      console.error("Sessão não obtida após login");
      throw new Error("Sessão não obtida após login automático");
    }

    console.log("Login automático realizado com sucesso");

    // Garantir que temos uma sessão válida com token de acesso
    console.log("Verificando sessão válida...");
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      console.error("Token de acesso não disponível");
      throw new Error("Sessão não propagada após registro/login. Tente novamente.");
    }

    console.log("Sessão válida obtida com token de acesso");
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequena pausa

    let companyId: string | undefined = undefined;

    if (isCompany) {
      console.log("Criando registro de empresa...");

      const { data: companyInsert, error: companyError } = await supabase
        .from("companies")
        .insert([{ 
          name, 
          email, 
          owner_id: userId 
        }])
        .select("id")
        .maybeSingle();

      if (companyError) {
        console.error("Erro completo na criação da empresa:", companyError);
        throw new Error("Erro ao criar empresa: " + companyError.message);
      }

      companyId = companyInsert?.id;
      console.log("Empresa criada com ID:", companyId);
    }

    // Etapa 4: atualizar profile com company_id + role
    console.log("Atualizando perfil do usuário...");
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ 
        company_id: companyId, 
        role: isCompany ? "admin" : "user" 
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error("Erro completo na atualização do perfil:", profileUpdateError);
      throw new Error("Erro ao atualizar perfil: " + profileUpdateError.message);
    }

    console.log("Registro completo realizado com sucesso");
    return {
      user: signUpData.user,
      companyId
    };
  } catch (error: any) {
    console.error("Erro no processo de registro:", error);
    throw error;
  }
}
