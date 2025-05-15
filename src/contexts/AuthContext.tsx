
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';
import { registerUser } from '@/lib/registerUser';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<{ user: User | null, companyId?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          navigate('/');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Check if the user is a collaborator and direct to waiting area if so
          if (session?.user) {
            setTimeout(async () => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('role, company_id')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profileData?.role === 'user' && !profileData?.company_id) {
                navigate('/waiting');
              } else if (profileData?.role === 'admin' || (profileData?.role === 'user' && profileData?.company_id)) {
                navigate('/app');
              }
            }, 0);
          }
        }
      }
    );

    // Check for an existing session
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    initSession();

    return () => {
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
      return { user: null };
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
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, error, signIn, signUp, signOut }}
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
