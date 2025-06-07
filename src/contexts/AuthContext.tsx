
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { hydrateUser } from '@/lib/hydrateUser';
import { Profile, CompanyProfile } from '@/types/profile';
import { Company } from '@/types/company';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  companyProfile: CompanyProfile | null;
  company: Company | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany?: boolean) => Promise<{ user: User | null; companyId?: string }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isCompanyAccount: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isCompanyAccount = !!companyProfile;

  const refreshUserData = async () => {
    try {
      const { profile: userProfile, companyProfile: userCompanyProfile, company: userCompany } = await hydrateUser();
      setProfile(userProfile);
      setCompanyProfile(userCompanyProfile);
      setCompany(userCompany);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshUserData().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          await refreshUserData();
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      } else {
        setProfile(null);
        setCompanyProfile(null);
        setCompany(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    if (data.user) {
      toast.success('Login realizado com sucesso!');
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/app';
      navigate(from, { replace: true });
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean = false) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_company: isCompany,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    if (data.user) {
      toast.success('Conta criada com sucesso!');
      
      // If it's a company, wait a bit for the trigger to create the company
      if (isCompany) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get the created company
        const { data: companies } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', data.user.id)
          .single();
          
        return { user: data.user, companyId: companies?.id };
      }
      
      navigate('/app');
      return { user: data.user };
    }

    return { user: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        companyProfile,
        company,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUserData,
        isCompanyAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
