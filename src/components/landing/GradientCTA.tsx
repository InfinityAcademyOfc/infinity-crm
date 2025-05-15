
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function GradientCTA() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      </div>
      
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Pronto para transformar seu negócio?
          </h2>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Comece a usar o Infinity CRM hoje mesmo e veja a diferença na gestão do seu relacionamento com clientes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white relative group overflow-hidden shadow-[0_0_20px_rgba(130,80,223,0.5)] hover:shadow-[0_0_30px_rgba(130,80,223,0.8)] transition-all duration-300">
                <span className="relative z-10">Cadastre-se gratuitamente</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute -inset-3 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></span>
              </Button>
            </Link>
            
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300">
                Fazer login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
