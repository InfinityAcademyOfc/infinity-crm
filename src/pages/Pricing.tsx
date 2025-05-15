
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from '@/components/pricing/PricingSection';
import Checkout from '@/components/pricing/Checkout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/ThemeToggle';

const Pricing = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string>("demo-company-id"); // This would normally come from a form or context
  const navigate = useNavigate();
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    // Scroll to checkout
    setTimeout(() => {
      const checkout = document.getElementById('checkout');
      if (checkout) {
        checkout.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBack = () => {
    setSelectedPlanId(null);
  };

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
          <Link to="/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container relative z-10 py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planos e Preços</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às necessidades do seu negócio
          </p>
        </div>

        <PricingSection 
          onSelectPlan={handleSelectPlan} 
          selectedPlanId={selectedPlanId || undefined}
          showRegisterLink={!selectedPlanId} 
        />
        
        {selectedPlanId && (
          <div id="checkout" className="mt-16 pt-4">
            <Card className="bg-black/40 border-white/10 backdrop-blur-lg shadow-[0_0_25px_rgba(130,80,223,0.2)]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Finalizar Compra</h2>
                  <Button variant="ghost" onClick={handleBack} className="text-primary">
                    Voltar aos planos
                  </Button>
                </div>
                
                <Checkout planId={selectedPlanId} companyId={companyId} onBack={handleBack} />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <footer className="container relative z-10 py-8 text-center text-white/50 text-sm">
        <p>© {new Date().getFullYear()} Infinity CRM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Pricing;
