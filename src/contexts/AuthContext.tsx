
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  company_id?: string;
}

interface Company {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  company: Company | null;
  loading: boolean;
  isCompanyAccount: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany?: boolean) => Promise<{ user?: User; companyId?: string }>;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const isCompanyAccount = !!company && !profile;

  const fetchUserData = async (userId: string) => {
    try {
      // Try to fetch profile first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        setProfile(profileData);
        
        // If profile has company_id, fetch company data
        if (profileData.company_id) {
          const { data: companyData } = await supabase
            .from('profiles_companies')
            .select('*')
            .eq('id', profileData.company_id)
            .single();
          
          if (companyData) {
            setCompany(companyData);
          }
        }
        return;
      }

      // If no profile, try to fetch company profile
      const { data: companyData, error: companyError } = await supabase
        .from('profiles_companies')
        .select('*')
        .eq('id', userId)
        .single();

      if (companyData && !companyError) {
        setCompany(companyData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchUserData(session.user.id);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setCompany(null);
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setCompany(null);
        }

        setLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, isCompany = true) => {
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

    toast.success('Conta criada com sucesso!');
    
    return {
      user: data.user,
      companyId: isCompany ? data.user?.id : undefined
    };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    setUser(null);
    setSession(null);
    setProfile(null);
    setCompany(null);
    toast.success('Logout realizado com sucesso!');
  };

  const value = {
    user,
    session,
    profile,
    company,
    loading,
    isCompanyAccount,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
