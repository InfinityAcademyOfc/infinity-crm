
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { loginUser } from "@/lib/auth/authUtils";
import LoadingScreen from "@/components/ui/loading-screen";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, isCompany: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  profile: any;
  company: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  // Handle authentication state
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
                  // Import dynamically to avoid circular dependencies
                  const { hydrateUser } = await import('@/lib/hydrateUser');
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
          // We don't use navigate here anymore - components will handle redirects
        }
      } else if (event === 'INITIAL_SESSION') {
        console.info("Existing session:", session);
        if (session && isMounted) {
          try {
            // Use setTimeout to prevent deadlocks with Supabase auth
            setTimeout(async () => {
              if (isMounted) {
                try {
                  // Import dynamically to avoid circular dependencies
                  const { hydrateUser } = await import('@/lib/hydrateUser');
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

  async function signIn(email: string, password: string) {
    try {
      const { user, session } = await loginUser(email, password);
      
      if (user) {
        toast.success("Login successful!");
        // navigate handled by component
      }
    } catch (error) {
      console.error("Error logging in:", error);
      let errorMessage = "Error logging in. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid credentials. Check your email and password.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email not confirmed. Check your inbox.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signUp(email: string, password: string, name: string, isCompany: boolean) {
    try {
      // Import dynamically to avoid circular dependencies
      const { registerUser } = await import('@/lib/auth/authUtils');
      const { user } = await registerUser(email, password, name, isCompany);

      if (user) {
        toast.success("Account created successfully! You will be redirected to the dashboard.");
        // Navigate handled by component
      }
    } catch (error: any) {
      console.error("Error creating account:", error);
      let errorMessage = "Error creating account. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Try logging in.";
        } else if (error.message.includes("Password should be")) {
          errorMessage = "The password does not meet security requirements.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signOut() {
    try {
      // Import dynamically to avoid circular dependencies
      const { logoutUser } = await import('@/lib/auth/authUtils');
      await logoutUser();
      // Navigate handled by onAuthStateChange
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error ending session");
    }
  }

  const value = {
    user: state.user,
    session: state.session,
    loading: state.loading,
    signIn,
    signUp,
    signOut,
    profile: state.profile,
    company: state.company
  };

  return (
    <AuthContext.Provider value={value}>
      {state.loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
