
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { registerUser } from '@/lib/registerUser';

interface Company {
  id: string;
  name: string;
  email: string;
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
      // Try to fetch company data first
      const { data: companyData, error: companyError } = await supabase
        .from('profiles_companies')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (companyData && !companyError) {
        setCompany(companyData);
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
        setCompany(null);
        
        // If profile has company_id, fetch company data
        if (profileData.company_id) {
          const { data: userCompanyData } = await supabase
            .from('profiles_companies')
            .select('*')
            .eq('id', profileData.company_id)
            .maybeSingle();
          
          if (userCompanyData) {
            setCompany(userCompanyData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string, isCompany: boolean) => {
    const result = await registerUser({
      email,
      password,
      name,
      isCompany
    });
    return {
      user: result.user,
      companyId: result.companyId
    };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setCompany(null);
    setProfile(null);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
