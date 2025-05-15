
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign, Banknote } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { planService } from '@/services/api/planService';
import { PlanWithFeatures } from '@/types/plan';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PaymentFormProps {
  planId: string;
  companyId: string;
  onBack: () => void;
}

const Checkout: React.FC<PaymentFormProps> = ({ planId, companyId, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [plan, setPlan] = useState<PlanWithFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const planData = await planService.getPlanById(planId);
        setPlan(planData);
      } catch (error) {
        console.error("Error fetching plan:", error);
        toast.error("Não foi possível carregar os detalhes do plano");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    
    setIsProcessing(true);
    
    try {
      // Criar uma assinatura para a empresa
      const { data: subscription, error: subscriptionError } = await supabase
        .from('company_subscriptions')
        .insert({
          company_id: companyId,
          plan_id: planId,
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: null // Para uma assinatura contínua
        })
        .select('id')
        .single();

      if (subscriptionError) {
        throw new Error(`Erro ao criar assinatura: ${subscriptionError.message}`);
      }

      // Atualizar o perfil da empresa com o ID da assinatura
      const { error: profileUpdateError } = await supabase
        .from('profiles_companies')
        .update({ 
          subscription_id: subscription.id
        })
        .eq('company_id', companyId);

      if (profileUpdateError) {
        throw new Error(`Erro ao atualizar perfil: ${profileUpdateError.message}`);
      }

      toast.success(`Assinatura do plano ${plan.name} criada com sucesso!`);
      
      // Redirecionar para o dashboard
      navigate('/app');
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.error(error.message || 'Ocorreu um erro ao processar o pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Plano não encontrado</p>
        <Button onClick={onBack} className="mt-4">Voltar</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Card className="bg-black/40 border-white/10 backdrop-blur-lg">
            <CardHeader>
              <h3 className="text-xl font-medium text-white">Método de Pagamento</h3>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit-card" onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="credit-card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pix
                  </TabsTrigger>
                  <TabsTrigger value="boleto" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Boleto
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credit-card">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Nome no cartão</Label>
                      <Input id="card-name" placeholder="Nome completo" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Número do cartão</Label>
                      <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 mt-6" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Processando...
                        </div>
                      ) : (
                        `Assinar ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}/mês`
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="pix">
                  <div className="text-center space-y-6 p-6">
                    <div className="bg-white p-4 mx-auto w-48 h-48 flex items-center justify-center rounded-lg">
                      <p className="text-black">QR Code do PIX</p>
                    </div>
                    <p className="text-sm">Escaneie o QR code ou copie o código PIX abaixo</p>
                    <div className="flex">
                      <Input value="12345678901234567890" readOnly className="bg-black/60" />
                      <Button variant="outline" className="ml-2" onClick={() => {
                        navigator.clipboard.writeText("12345678901234567890");
                        toast.success("Código PIX copiado!");
                      }}>
                        Copiar
                      </Button>
                    </div>
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full bg-primary hover:bg-primary/90 mt-4" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Verificando pagamento..." : "Já paguei"}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="boleto">
                  <div className="space-y-6 p-2">
                    <p>Gere um boleto para pagamento da sua assinatura. Após o pagamento, pode levar até 3 dias úteis para a confirmação.</p>
                    <div className="flex justify-between items-center p-4 border rounded-md border-white/20 bg-black/30">
                      <div>
                        <p className="text-sm text-white/70">Código do boleto:</p>
                        <p className="font-mono text-xs mt-1">23790.12345 67890.123456 78901.234567 8 91234567890123</p>
                      </div>
                      <Button variant="outline" onClick={() => {
                        navigator.clipboard.writeText("23790.12345 67890.123456 78901.234567 8 91234567890123");
                        toast.success("Código do boleto copiado!");
                      }}>
                        Copiar
                      </Button>
                    </div>
                    <Button onClick={() => toast.success("Boleto enviado para seu email!")} className="w-full" variant="outline">
                      Enviar por e-mail
                    </Button>
                    <Button onClick={() => window.print()} className="w-full" variant="outline">
                      Imprimir boleto
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processando..." : "Confirmar pagamento"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="bg-black/40 border-white/10 backdrop-blur-lg h-full">
            <CardHeader>
              <h3 className="text-lg font-medium text-white">Resumo da compra</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-white/70">Plano</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Período</span>
                <span className="font-medium">Mensal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Valor</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}/mês
                </span>
              </div>
              
              <hr className="border-t border-white/10 my-4" />
              
              <div className="flex justify-between text-lg">
                <span className="text-white/70">Total</span>
                <span className="font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}/mês
                </span>
              </div>
              
              <div className="bg-primary/10 p-3 rounded-md mt-6 text-sm border border-primary/20">
                <p>Você pode cancelar ou mudar seu plano a qualquer momento através das configurações da sua conta.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
