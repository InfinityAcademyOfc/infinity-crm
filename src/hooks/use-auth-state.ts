
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { hydrateUser } from "@/lib/hydrateUser";
import { useNavigate } from "react-router-dom";

export const useAuthState = () => {
  const [state, setState] = useState<{
    user: User | null;
    session: Session | null;
    profile: any;
    company: any;
    loading: boolean;
  }>({
    user: null,
    session: null,
    profile: null,
    company: null,
    loading: true,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    console.info("Inicializando AuthContext");
    
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("Evento de autenticação:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              const hydrationResult = await hydrateUser();
              setState({
                user: session.user,
                session,
                profile: hydrationResult.profile,
                company: hydrationResult.company,
                loading: false
              });
            }, 0);
          } catch (error) {
            console.error("Erro na hidratação do usuário:", error);
            setState({
              user: session.user,
              session,
              profile: null,
              company: null,
              loading: false
            });
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setState({ user: null, session: null, profile: null, company: null, loading: false });
        navigate('/login', { replace: true });
      } else if (event === 'INITIAL_SESSION') {
        console.info("Sessão existente:", session);
        if (session) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              const hydrationResult = await hydrateUser();
              setState({
                user: session.user,
                session,
                profile: hydrationResult.profile,
                company: hydrationResult.company,
                loading: false
              });
            }, 0);
          } catch (error) {
            console.error("Erro na hidratação do usuário:", error);
            setState({
              user: session.user,
              session,
              profile: null,
              company: null,
              loading: false
            });
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return state;
};
