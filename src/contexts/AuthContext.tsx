
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { Company, CompanyProfile } from '@/types/company';
import { UserProfile } from '@/types/user';
import { CompanySubscription, Plan } from '@/types/plan';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  companyProfile: CompanyProfile | null;
  company: Company | null;
  subscription: CompanySubscription | null;
  plan: Plan | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<{ user: User | null, companyId?: string }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isCompanyAccount: boolean;
  isCompany: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [subscription, setSubscription] = useState<CompanySubscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompanyAccount, setIsCompanyAccount] = useState(false);
  const navigate = useNavigate();

  const hydrateUserData = async (currentUser: User) => {
    try {
      // Primeiro tenta buscar perfil de empresa
      const { data: companyData } = await supabase
        .from('profiles_companies')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (companyData) {
        setCompanyProfile(companyData);
        setIsCompanyAccount(true);
        
        // Busca dados da empresa
        const { data: companyInfo } = await supabase
          .from('companies')
          .select('*')
          .eq('owner_id', currentUser.id)
          .single();
        
        if (companyInfo) {
          setCompany(companyInfo);
        }
      } else {
        // Busca perfil de usuário colaborador
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          
          // Se tem empresa associada, busca dados da empresa
          if (profileData.company_id) {
            const { data: companyInfo } = await supabase
              .from('companies')
              .select('*')
              .eq('id', profileData.company_id)
              .single();
            
            if (companyInfo) {
              setCompany(companyInfo);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro ao hidratar dados do usuário:", error);
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    await hydrateUserData(user);
  };

  useEffect(() => {
    let isMounted = true;
    
    // Configura listener de mudanças de autenticação
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth event:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setCompanyProfile(null);
          setCompany(null);
          setSubscription(null);
          setPlan(null);
          setIsCompanyAccount(false);
          setLoading(false);
          navigate('/login');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            await hydrateUserData(session.user);
            setLoading(false);
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user) {
            await hydrateUserData(session.user);
          }
          setLoading(false);
        }
      }
    );

    // Verifica sessão inicial
    const initSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await hydrateUserData(data.session.user);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão inicial:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            is_company: isCompany
          }
        }
      });

      if (error) {
        throw error;
      }

      if (isCompany) {
        toast.success("Conta empresarial criada com sucesso!");
        return { user: data.user };
      } else {
        toast.success("Cadastro realizado! Aguardando convite de uma empresa.");
        navigate('/waiting');
        return { user: data.user };
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        session, 
        profile,
        companyProfile,
        company, 
        subscription,
        plan,
        loading, 
        error, 
        signIn, 
        signUp, 
        signOut,
        refreshUserData,
        isCompanyAccount,
        isCompany: isCompanyAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
