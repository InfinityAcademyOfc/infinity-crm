
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser } from "@/lib/auth/authUtils";
import { useAuthState } from "@/hooks/use-auth-state";
import LoadingScreen from "@/components/ui/loading-screen";

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
  const { user, session, profile, company, loading } = useAuthState();
  const navigate = useNavigate();

  async function signIn(email: string, password: string) {
    try {
      const { user, session } = await loginUser(email, password);
      
      if (user) {
        toast.success("Login realizado com sucesso!");
        navigate('/app', { replace: true });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signUp(email: string, password: string, name: string, isCompany: boolean) {
    try {
      // Importar dinamicamente para evitar dependências cíclicas
      const { registerUser } = await import('@/lib/auth/authUtils');
      const { user } = await registerUser(email, password, name, isCompany);

      if (user) {
        toast.success("Conta criada com sucesso! Você será redirecionado para o dashboard.");
        navigate('/app', { replace: true });
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes("User already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        } else if (error.message.includes("Password should be")) {
          errorMessage = "A senha não atende aos requisitos de segurança.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signOut() {
    try {
      // Importar dinamicamente para evitar dependências cíclicas
      const { logoutUser } = await import('@/lib/auth/authUtils');
      await logoutUser();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao encerrar sessão");
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    profile,
    company
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
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
