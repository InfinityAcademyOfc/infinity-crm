
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/user";
import { Company, CompanyProfile } from "@/types/company";

export async function hydrateUser() {
  console.log("Iniciando hidratação dos dados do usuário...");

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Erro ao obter sessão:", sessionError);
    throw new Error("Não foi possível obter a sessão do usuário");
  }

  const userId = sessionData?.session?.user?.id;

  if (!userId) {
    console.log("Usuário não autenticado");
    throw new Error("Usuário não autenticado!");
  }

  console.log("Buscando perfis para o usuário:", userId);

  try {
    // Primeiro verificamos se é uma conta empresarial (profiles_companies)
    const { data: companyProfile, error: companyProfileError } = await supabase
      .from("profiles_companies")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!companyProfileError && companyProfile) {
      console.log("Perfil empresarial encontrado:", companyProfile);
      
      let company: Company | null = null;
      if (companyProfile.company_id) {
        console.log("Buscando empresa:", companyProfile.company_id);
        try {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", companyProfile.company_id)
            .maybeSingle();

          if (companyError) {
            console.error("Erro ao buscar empresa:", companyError);
            console.log("Continuando sem dados da empresa");
          } else {
            console.log("Empresa encontrada:", companyData);
            company = companyData;
          }
        } catch (companyError) {
          console.error("Erro ao buscar empresa:", companyError);
        }
      }

      console.log("Hidratação de dados concluída para conta empresarial");
      return {
        profile: null,
        companyProfile,
        company
      };
    }

    // Se não for uma conta empresarial, busca no profiles (colaborador)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      // Retornar perfil mínimo em vez de lançar erro para evitar loop
      return {
        profile: {
          id: userId,
          name: "Usuário",
          email: sessionData.session.user.email,
          role: "user",
          status: "active",
          company_id: null
        } as UserProfile,
        companyProfile: null,
        company: null
      };
    }

    console.log("Perfil colaborador encontrado:", profile);

    let company: Company | null = null;
    if (profile && profile.company_id) {
      console.log("Buscando empresa:", profile.company_id);
      try {
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", profile.company_id)
          .maybeSingle();

        if (companyError) {
          console.error("Erro ao buscar empresa:", companyError);
          console.log("Continuando sem dados da empresa");
        } else {
          console.log("Empresa encontrada:", companyData);
          company = companyData;
        }
      } catch (companyError) {
        console.error("Erro ao buscar empresa:", companyError);
      }
    }

    console.log("Hidratação de dados concluída para colaborador");
    return {
      profile: profile || {
        id: userId,
        name: "Usuário",
        email: sessionData.session.user.email,
        role: "user",
        status: "active",
        company_id: null
      } as UserProfile,
      companyProfile: null,
      company
    };
  } catch (error) {
    console.error("Erro inesperado na hidratação do usuário:", error);
    // Retornar perfil mínimo para previnir bloqueio do fluxo de autenticação
    return {
      profile: {
        id: userId,
        name: "Usuário",
        email: sessionData.session.user.email,
        role: "user",
        status: "active",
        company_id: null
      } as UserProfile,
      companyProfile: null,
      company: null
    };
  }
}
