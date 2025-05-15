
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ThemeToggle from '@/components/theme/ThemeToggle';

const WaitingArea = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="container relative z-10 px-4 py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Infinity CRM
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-lg bg-black/40 border-white/10 backdrop-blur-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold">Aguardando convite</h2>
              
              <p className="text-white/70">
                Olá, {user?.user_metadata?.name || 'Colaborador'}!<br/>
                Seu cadastro foi realizado com sucesso. Agora você precisa aguardar o convite de uma empresa para acessar o Infinity CRM.
              </p>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                <p className="text-sm text-white/80">
                  Status: <span className="font-semibold text-primary">Aguardando convite</span>
                </p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5" onClick={() => window.location.reload()}>
                  Verificar novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WaitingArea;
