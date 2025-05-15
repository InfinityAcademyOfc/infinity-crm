
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { PlanWithFeatures } from '@/types/plan';
import { planService } from '@/services/api/planService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CheckoutProps {
  planId: string;
  companyId: string;
  onBack: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ planId, companyId, onBack, onComplete }) => {
  const [plan, setPlan] = useState<PlanWithFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const plans = await planService.getPlansWithFeatures();
        const selectedPlan = plans.find(p => p.id === planId);
        if (selectedPlan) {
          setPlan(selectedPlan);
        }
      } catch (error) {
        console.error('Error loading plan:', error);
      }
    };
    
    loadPlan();
  }, [planId]);

  const handleSkipPayment = async () => {
    setIsLoading(true);
    try {
      await planService.createSubscription(companyId, planId);
      toast.success("Plano ativado com sucesso!");
      onComplete();
      navigate('/app');
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error("Erro ao ativar plano");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePayment = async () => {
    // This is where you would integrate with a payment gateway
    // For now, we'll just create the subscription without payment
    setIsLoading(true);
    try {
      await planService.createSubscription(companyId, planId);
      toast.success("Pagamento processado com sucesso!");
      onComplete();
      navigate('/app');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) {
    return (
      <Card className="bg-black/40 border-white/10 backdrop-blur-lg w-full max-w-lg">
        <CardContent className="p-8">
          <div className="animate-pulse h-64 bg-gray-800/50 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-lg w-full max-w-lg">
      <CardContent className="p-8">
        <button onClick={onBack} className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Voltar para seleção de plano
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-white">Finalize sua assinatura</h2>
        
        <div className="border border-white/10 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Plano {plan.name}</h3>
            <span className="font-bold text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: plan.currency || 'BRL'
              }).format(plan.price)}
              <span className="text-sm font-normal text-white/70">/mês</span>
            </span>
          </div>
          
          <div className="bg-white/5 p-3 rounded-md">
            <p className="text-sm text-white/70 mb-1">Este plano inclui:</p>
            <ul className="text-sm space-y-1">
              {plan.features.slice(0, 5).map((feature, idx) => (
                <li key={idx} className="text-white/90">• {feature.feature_value} {feature.description}</li>
              ))}
              {plan.features.length > 5 && (
                <li className="text-primary">• E muito mais...</li>
              )}
            </ul>
          </div>
        </div>
        
        {plan.price > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-white/70 text-sm mb-4">
                Em breve teremos integração com gateway de pagamento. Por enquanto, você pode utilizar o plano sem custos até implementarmos o sistema de pagamentos.
              </p>
              
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Subtotal</span>
                  <span className="text-white">{new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: plan.currency || 'BRL'
                  }).format(plan.price)}</span>
                </div>
                <div className="border-t border-white/10 my-2 pt-2 flex items-center justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-semibold text-white">{new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: plan.currency || 'BRL'
                  }).format(plan.price)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? "Processando..." : "Finalizar assinatura"}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/5"
                onClick={handleSkipPayment}
                disabled={isLoading}
              >
                Pular pagamento por enquanto
              </Button>
            </div>
          </>
        ) : (
          <Button 
            onClick={handleSkipPayment}
            className="w-full bg-primary hover:bg-primary/90" 
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Ativar plano gratuito"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Checkout;
