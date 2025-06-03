
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface Plan {
  id: string;
  name: string;
  code: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  active: boolean;
}

const PlansSettings = () => {
  const { user, company } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select(`
          id,
          name,
          code,
          price,
          currency,
          description,
          active,
          plan_features (
            feature_key,
            feature_value,
            description
          )
        `)
        .eq('active', true)
        .order('price');

      if (error) throw error;

      const plansWithFeatures = data?.map(plan => ({
        ...plan,
        features: plan.plan_features?.map(f => f.description || f.feature_key) || []
      })) || [];

      setPlans(plansWithFeatures);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      // Mock data para demonstração
      setPlans([
        {
          id: '1',
          name: 'Básico',
          code: 'basic',
          price: 29.90,
          currency: 'BRL',
          description: 'Ideal para pequenas empresas',
          features: [
            'Até 100 leads por mês',
            'Dashboard básico',
            'Suporte por email',
            '1 usuário'
          ],
          active: true
        },
        {
          id: '2',
          name: 'Profissional',
          code: 'pro',
          price: 79.90,
          currency: 'BRL',
          description: 'Para empresas em crescimento',
          features: [
            'Leads ilimitados',
            'Dashboard avançado',
            'Automações',
            'Até 5 usuários',
            'Suporte prioritário',
            'Relatórios avançados'
          ],
          active: true
        },
        {
          id: '3',
          name: 'Enterprise',
          code: 'enterprise',
          price: 199.90,
          currency: 'BRL',
          description: 'Para grandes empresas',
          features: [
            'Todas as funcionalidades',
            'Usuários ilimitados',
            'API personalizada',
            'Suporte 24/7',
            'Treinamento dedicado',
            'Integrações avançadas'
          ],
          active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from('company_subscriptions')
        .select('plan_id')
        .eq('company_id', company.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setCurrentPlan(data?.plan_id || null);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    }
  };

  const handleUpgrade = async (planId: string, planName: string) => {
    toast.info(`Upgrade para ${planName} será implementado em breve`);
  };

  const getPlanIcon = (planCode: string) => {
    switch (planCode) {
      case 'basic':
        return <Star className="h-5 w-5" />;
      case 'pro':
        return <Zap className="h-5 w-5" />;
      case 'enterprise':
        return <Crown className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planos e Assinatura</CardTitle>
          <CardDescription>
            Gerencie seu plano atual e explore opções de upgrade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan === plan.id;
              const isBasic = plan.code === 'basic';
              const isPro = plan.code === 'pro';
              const isEnterprise = plan.code === 'enterprise';

              return (
                <Card
                  key={plan.id}
                  className={`relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''} ${
                    isPro ? 'border-primary' : ''
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-white">Mais Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      {getPlanIcon(plan.code)}
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2">
                      {plan.name}
                      {isCurrentPlan && (
                        <Badge variant="secondary" className="text-xs">Atual</Badge>
                      )}
                    </CardTitle>
                    <div className="text-3xl font-bold">
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : isPro ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.id, plan.name)}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            Visualize seu histórico de faturas e pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma fatura encontrada</p>
            <p className="text-sm mt-2">O histórico de pagamentos aparecerá aqui após a primeira cobrança</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlansSettings;
