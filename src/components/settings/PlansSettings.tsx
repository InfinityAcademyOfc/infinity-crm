import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlanWithFeatures } from '@/types/plan';
import { planService } from '@/services/api/planService';
import { useAuth } from '@/contexts/AuthContext';
import PlanCard from '@/components/pricing/PlanCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, CreditCard } from 'lucide-react';
import { supabase } from "@/integrations/supabase"; // Importar do index.ts
import { toast } from 'sonner';
import { logError } from '@/utils/logger'; // Importar o logger

const PlansSettings = () => {
  const { companyProfile, company } = useAuth();
  const [plans, setPlans] = useState<PlanWithFeatures[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanWithFeatures | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!companyProfile) return;

      try {
        if (companyProfile.company_id) {
          setCompanyId(companyProfile.company_id);
          
          // Get company's subscription
          const subscription = await planService.getCompanySubscription(companyProfile.company_id);
          
          if (subscription) {
            // Load all plans
            const allPlans = await planService.getPlansWithFeatures();
            setPlans(allPlans);
            
            // Find the current plan
            const currentPlanData = allPlans.find(plan => plan.id === subscription.plan_id);
            if (currentPlanData) {
              setCurrentPlan(currentPlanData);
            }
          } else {
            // Sem assinatura - carregar todos os planos de qualquer maneira
            const allPlans = await planService.getPlansWithFeatures();
            setPlans(allPlans);
            // Plano gratuito como padrão se não houver assinatura
            setCurrentPlan(allPlans.find(plan => plan.code === 'free') || null);
          }
        }
      } catch (error) {
        logError('Error fetching company info:', error, { component: "PlansSettings" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [companyProfile]);

  const handleChangePlan = async (planId: string) => {
    if (!companyId || !companyProfile) return;
    
    try {
      // Check if there's an existing subscription
      const existingSubscription = await planService.getCompanySubscription(companyId);
      
      if (existingSubscription) {
        // Update existing subscription
        const { error } = await supabase
          .from('company_subscriptions')
          .update({
            plan_id: planId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscription.id);
          
        if (error) throw error;
      } else {
        // Create new subscription
        const { data, error } = await supabase
          .from('company_subscriptions')
          .insert({
            company_id: companyId,
            plan_id: planId,
            status: 'active',
            started_at: new Date().toISOString()
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Update company profile with subscription ID
        if (data) {
          const { error: updateError } = await supabase
            .from('profiles_companies')
            .update({ subscription_id: data.id })
            .eq('id', companyProfile.id);
            
          if (updateError) throw updateError;
        }
      }
      
      // Reload plans data
      const newPlanData = await planService.getPlanById(planId);
      if (newPlanData) {
        setCurrentPlan(newPlanData);
        toast.success(`Plano alterado para ${newPlanData.name} com sucesso!`);
      }
    } catch (error) {
      logError('Error changing plan:', error, { component: "PlansSettings" });
      toast.error('Não foi possível alterar o plano. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Plano atual</CardTitle>
            <CardDescription>Detalhes do seu plano atual e uso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-40 w-full rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Plano atual</CardTitle>
          <CardDescription>Detalhes do seu plano atual e uso</CardDescription>
        </CardHeader>
        <CardContent>
          {currentPlan ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Plano {currentPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan.price === 0 ? 'Gratuito' : `R$ ${currentPlan.price}/mês`}
                  </p>
                </div>
                <div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Gerenciar pagamento</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPlan.features.map((feature) => (
                  <div key={feature.id} className="bg-muted/50 rounded-md p-3">
                    <p className="font-medium">{feature.description}</p>
                    <p className="text-primary font-semibold">
                      {feature.feature_value === 'unlimited' ? 'Ilimitado' : 
                       feature.feature_value === 'true' ? 'Sim' : 
                       feature.feature_value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">Nenhum plano ativo encontrado</p>
              <Button variant="default" className="mt-4">
                Escolher um plano
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mudar de plano</CardTitle>
          <CardDescription>Compare os planos disponíveis e escolha o mais adequado para o seu negócio</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="card-view">
            <TabsList className="mb-6">
              <TabsTrigger value="card-view">Cartões</TabsTrigger>
              <TabsTrigger value="table-view">Tabela comparativa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card-view">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <PlanCard 
                    key={plan.id}
                    plan={plan}
                    isPopular={plan.code === 'pro'}
                    onSelectPlan={handleChangePlan}
                    isSelected={currentPlan?.id === plan.id}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="table-view">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Recurso</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center p-3">
                          <div>
                            <div className="font-bold">{plan.name}</div>
                            <div>{plan.price === 0 ? 'Grátis' : `R$ ${plan.price}/mês`}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamically generate rows based on feature keys */}
                    {plans.length > 0 && plans[0].features.map((feature) => (
                      <tr key={feature.feature_key} className="border-b">
                        <td className="p-3 font-medium">{feature.description}</td>
                        {plans.map((plan) => {
                          const planFeature = plan.features.find(f => f.feature_key === feature.feature_key);
                          return (
                            <td key={`${plan.id}-${feature.feature_key}`} className="text-center p-3">
                              {planFeature?.feature_value === 'unlimited' ? 'Ilimitado' : 
                               planFeature?.feature_value === 'true' ? 'Sim' : 
                               planFeature?.feature_value === 'false' ? 'Não' : 
                               planFeature?.feature_value || '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Recursos adicionais</CardTitle>
          <CardDescription>Adicione recursos específicos ao seu plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Usuários adicionais</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adicione mais usuários à sua conta além do limite do seu plano atual
                </p>
                <Button variant="outline">
                  Adicionar usuários
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Integrações premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Acesse integrações avançadas com outras plataformas
                </p>
                <Button variant="outline">
                  Ver integrações
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Suporte dedicado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tenha um gerente de conta dedicado para ajudar com sua implementação
                </p>
                <Button variant="outline">
                  Contratar suporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlansSettings;


