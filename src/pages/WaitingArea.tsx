
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/theme/ThemeToggle';

const WaitingArea = () => {
  const { profile, signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="container relative z-10 px-4 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/5" onClick={signOut}>
            Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg">
          <Card className="bg-black/40 border-white/10 backdrop-blur-lg shadow-[0_0_25px_rgba(130,80,223,0.2)]">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">Área de Espera</CardTitle>
              <CardDescription className="text-center text-white/70">
                Aguardando convite de uma empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4">
                  <span className="text-4xl">🙋</span>
                </div>
                <h3 className="text-xl font-medium text-white mt-4">Olá, {profile?.name || 'Colaborador'}</h3>
                <p className="text-white/70 mt-2">
                  {profile?.email}
                </p>
              </div>
              
              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-white text-center">
                  Seu cadastro foi realizado com sucesso! Aguarde o convite de uma empresa para acessar o Infinity CRM.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-white/10 pt-4">
              <Button variant="ghost" className="text-primary" onClick={signOut}>
                Sair da conta
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WaitingArea;
