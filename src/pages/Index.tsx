
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { ArrowRight, BarChart3, Users, MessageSquare, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="container relative z-10 px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">Infinity CRM</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90">
              Cadastrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              O CRM Completo para seu Negócio
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Gerencie leads, clientes, vendas e muito mais em uma plataforma única e intuitiva.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                Ver Preços
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <Card className="bg-black/40 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-white text-center">Funil de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Acompanhe seus leads desde o primeiro contato até o fechamento
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-white text-center">Gestão de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Mantenha um relacionamento próximo com todos os seus clientes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-white text-center">WhatsApp Business</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Integração completa com WhatsApp para atendimento
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <Settings className="h-10 w-10 text-primary mx-auto" />
                <CardTitle className="text-white text-center">Automações</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Automatize processos e economize tempo no dia a dia
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="container relative z-10 px-4 py-8 text-center text-gray-400">
        <p>&copy; 2024 Infinity CRM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Index;
