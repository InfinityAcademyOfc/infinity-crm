
import React from 'react';
import PricingSection from '@/components/pricing/PricingSection';

const PricingPlans = () => {
  return (
    <div className="py-20 relative" id="planos">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
              Planos
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
            Escolha o plano ideal para o seu negócio
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Temos opções para empresas de todos os tamanhos, desde startups até grandes corporações.
          </p>
        </div>
        
        <PricingSection showButtons={true} showRegisterLink={true} />
      </div>
    </div>
  );
};

export default PricingPlans;
