
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AnimatedHero() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container px-4 md:px-6 mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <div className="relative inline-block">
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
              Nova Geração de CRM
            </span>
            <div className="absolute -inset-1 rounded-full blur-md bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Transforme o <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">relacionamento</span> com seus clientes
          </h1>
          
          <p className="text-xl text-white/70 max-w-lg">
            A plataforma completa que ajuda empresas a organizar leads, acompanhar vendas e fidelizar clientes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Começar agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </Link>
            
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5">
                Acessar sistema
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="relative z-10 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              alt="Dashboard Preview"
              className="w-full h-auto aspect-[16/9] object-cover"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1170&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 pointer-events-none"></div>
          </div>
          
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-blue-500/30 to-purple-500/30 rounded-xl blur-xl opacity-50 -z-10"></div>
        </div>
      </div>
    </div>
  );
}
