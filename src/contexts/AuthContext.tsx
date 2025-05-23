
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { registerUser } from '@/lib/registerUser';
import { hydrateUser } from '@/lib/hydrateUser';
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
  isCompany: boolean; // Added this property to match usage
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

  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      const hydrationResult = await hydrateUser();
      setProfile(hydrationResult.profile);
      setCompanyProfile(hydrationResult.companyProfile);
      setCompany(hydrationResult.company);
      setSubscription(hydrationResult.subscription);
      setPlan(hydrationResult.plan);
      setIsCompanyAccount(!!hydrationResult.companyProfile);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
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
          navigate('/');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Use setTimeout to prevent deadlock with Supabase auth
            setTimeout(async () => {
              if (!isMounted) return;
              
              try {
                const hydrationResult = await hydrateUser();
                setProfile(hydrationResult.profile);
                setCompanyProfile(hydrationResult.companyProfile);
                setCompany(hydrationResult.company);
                setSubscription(hydrationResult.subscription);
                setPlan(hydrationResult.plan);
                setIsCompanyAccount(!!hydrationResult.companyProfile);
                setLoading(false);
                
                // Lógica para direcionar com base no tipo de conta
                if (hydrationResult.companyProfile) {
                  // É uma conta empresarial - vai para o CRM
                  navigate('/app');
                } else if (hydrationResult.profile?.role === 'user' && !hydrationResult.profile?.company_id) {
                  // É um colaborador sem empresa associada - vai para área de espera
                  navigate('/waiting');
                } else if (hydrationResult.profile?.role === 'user' && hydrationResult.profile?.company_id) {
                  // É um colaborador com empresa associada - vai para o CRM
                  navigate('/app');
                }
              } catch (error) {
                console.error("Error in hydration:", error);
                setLoading(false);
              }
            }, 0);
          }
        } else if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Check for an existing session
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!isMounted) return;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      
      if (data.session?.user) {
        // Use setTimeout to prevent deadlock with Supabase auth
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            const hydrationResult = await hydrateUser();
            setProfile(hydrationResult.profile);
            setCompanyProfile(hydrationResult.companyProfile);
            setCompany(hydrationResult.company);
            setSubscription(hydrationResult.subscription);
            setPlan(hydrationResult.plan);
            setIsCompanyAccount(!!hydrationResult.companyProfile);
          } catch (error) {
            console.error("Error in initial hydration:", error);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    };

    initSession();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
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
      throw error; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const result = await registerUser({ email, password, name, isCompany });
      
      if (isCompany) {
        return { 
          user: result.user, 
          companyId: result.companyId 
        };
      } else {
        toast.success("Cadastro realizado! Aguardando convite de uma empresa.");
        navigate('/waiting');
        return { user: result.user };
      }
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      throw error; // Re-throw to handle in the component
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
        isCompany: isCompanyAccount // Added this property
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
