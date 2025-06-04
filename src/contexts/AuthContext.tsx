
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { registerUser } from '@/lib/registerUser';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  email: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  company_id?: string;
  phone?: string;
  department?: string;
  avatar?: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  profile: Profile | null;
  loading: boolean;
  isCompanyAccount: boolean;
  companyProfile: Company | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<{ user: User; companyId?: string }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
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
  const [company, setCompany] = useState<Company | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const isCompanyAccount = user?.user_metadata?.is_company === true;
  const companyProfile = isCompanyAccount ? company : null;

  const fetchUserData = async (userId: string) => {
    try {
      // Try to fetch company data first (for company accounts)
      const { data: companyData, error: companyError } = await supabase
        .from('profiles_companies')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (companyData && !companyError) {
        // Map the company data to match our Company interface
        const mappedCompany: Company = {
          id: companyData.id,
          name: companyData.name,
          email: companyData.email,
          owner_id: companyData.id, // Use id as owner_id for companies
          created_at: companyData.created_at,
          updated_at: companyData.updated_at
        };
        setCompany(mappedCompany);
        setProfile(null);
        return;
      }

      // If not a company, fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileData && !profileError) {
        setProfile(profileData);
        
        // If profile has company_id, fetch company data
        if (profileData.company_id) {
          const { data: userCompanyData } = await supabase
            .from('profiles_companies')
            .select('*')
            .eq('id', profileData.company_id)
            .maybeSingle();
          
          if (userCompanyData) {
            const mappedUserCompany: Company = {
              id: userCompanyData.id,
              name: userCompanyData.name,
              email: userCompanyData.email,
              owner_id: userCompanyData.id,
              created_at: userCompanyData.created_at,
              updated_at: userCompanyData.updated_at
            };
            setCompany(mappedUserCompany);
          } else {
            // Try companies table
            const { data: companiesData } = await supabase
              .from('companies')
              .select('*')
              .eq('id', profileData.company_id)
              .maybeSingle();
            
            if (companiesData) {
              setCompany(companiesData);
            }
          }
        } else {
          setCompany(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Erro ao carregar dados do usuário');
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setCompany(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    try {
      setLoading(true);
      const result = await registerUser({
        email,
        password,
        name,
        isCompany
      });
      toast.success('Conta criada com sucesso!');
      return {
        user: result.user,
        companyId: result.companyId
      };
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Erro ao criar conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setCompany(null);
      setProfile(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Erro ao fazer logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    company,
    profile,
    loading,
    isCompanyAccount,
    companyProfile,
    signIn,
    signUp,
    signOut,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
