
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase';
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
  const [loading, setLoading] = useState(false); // Changed to false for immediate rendering
  const navigate = useNavigate();
  const location = useLocation();

  const isCompanyAccount = !!companyProfile;

  // Optimized user data fetching with parallel queries
  const refreshUserData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Parallel data fetching for better performance
      const [companyProfileResult, profileResult] = await Promise.allSettled([
        supabase.from("profiles_companies").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      ]);

      if (companyProfileResult.status === 'fulfilled' && companyProfileResult.value.data) {
        setCompanyProfile(companyProfileResult.value.data);
        
        // Fetch company data if available
        if (companyProfileResult.value.data.company_id) {
          const { data: companyData } = await supabase
            .from("companies")
            .select("*")
            .eq("id", companyProfileResult.value.data.company_id)
            .maybeSingle();
          setCompany(companyData);
        }
      } else if (profileResult.status === 'fulfilled' && profileResult.value.data) {
        setProfile(profileResult.value.data);
        
        // Fetch company data if available
        if (profileResult.value.data.company_id) {
          const { data: companyData } = await supabase
            .from("companies")
            .select("*")
            .eq("id", profileResult.value.data.company_id)
            .maybeSingle();
          setCompany(companyData);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    // Get initial session without blocking
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        // Non-blocking user data refresh
        setTimeout(() => refreshUserData(), 0);
      }
    });

    // Optimized auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Background data fetching without blocking UI
        setTimeout(() => refreshUserData(), 0);
      } else {
        setProfile(null);
        setCompanyProfile(null);
        setCompany(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUserData]);

  const signIn = useCallback(async (email: string, password: string) => {
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
      
      // Instant navigation
      const from = location.state?.from?.pathname || '/app';
      navigate(from, { replace: true });
    }
  }, [location.state, navigate]);

  const signUp = useCallback(async (email: string, password: string, name: string, isCompany: boolean = false) => {
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
      
      if (isCompany) {
        // Background company creation check
        setTimeout(async () => {
          const { data: companies } = await supabase
            .from('companies')
            .select('id')
            .eq('owner_id', data.user.id)
            .single();
          return companies?.id;
        }, 1000);
      }
      
      navigate('/app');
      return { user: data.user };
    }

    return { user: null };
  }, [navigate]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  }, [navigate]);

  const contextValue = useMemo(() => ({
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
  }), [user, profile, companyProfile, company, loading, signIn, signUp, signOut, refreshUserData, isCompanyAccount]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
