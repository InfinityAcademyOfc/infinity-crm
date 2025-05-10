
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { hydrateUser } from "@/lib/hydrateUser";
import { toast } from "sonner";

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
  
  useEffect(() => {
    console.info("Initializing AuthContext");
    let isMounted = true;
    
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("Auth event:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user && isMounted) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              if (isMounted) {
                try {
                  const hydrationResult = await hydrateUser();
                  setState({
                    user: session.user,
                    session,
                    profile: hydrationResult.profile,
                    company: hydrationResult.company,
                    loading: false
                  });
                } catch (error) {
                  console.error("Error hydrating user:", error);
                  setState({
                    user: session.user,
                    session,
                    profile: {
                      id: session.user.id,
                      name: "User",
                      email: session.user.email,
                      role: "user",
                      status: "active"
                    },
                    company: null,
                    loading: false
                  });
                }
              }
            }, 0);
          } catch (error) {
            if (isMounted) {
              console.error("Error hydrating user:", error);
              setState({
                user: session.user,
                session,
                profile: {
                  id: session.user.id,
                  name: "User",
                  email: session.user.email,
                  role: "user",
                  status: "active"
                },
                company: null,
                loading: false
              });
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setState({ user: null, session: null, profile: null, company: null, loading: false });
          // Navigation handled at component level
        }
      } else if (event === 'INITIAL_SESSION') {
        console.info("Existing session:", session);
        if (session && isMounted) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              if (isMounted) {
                try {
                  const hydrationResult = await hydrateUser();
                  setState({
                    user: session.user,
                    session,
                    profile: hydrationResult.profile,
                    company: hydrationResult.company,
                    loading: false
                  });
                } catch (error) {
                  console.error("Error hydrating user:", error);
                  setState({
                    user: session.user,
                    session,
                    profile: {
                      id: session.user.id,
                      name: "User",
                      email: session.user.email,
                      role: "user",
                      status: "active"
                    },
                    company: null,
                    loading: false
                  });
                }
              }
            }, 0);
          } catch (error) {
            if (isMounted) {
              console.error("Error hydrating user:", error);
              setState({
                user: session.user,
                session,
                profile: null,
                company: null,
                loading: false
              });
            }
          }
        } else if (isMounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && isMounted) {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
