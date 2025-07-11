import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Building2, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from "@/contexts/AuthContext";
import { planService } from '@/services/api/planService';
import { Plan, PlanWithFeatures } from '@/types/plan';
import PricingSection from '@/components/pricing/PricingSection';
import Checkout from '@/components/pricing/Checkout';
import { supabase } from "@/integrations/supabase"; // Importar do index.ts
import { toast } from 'sonner';
import { logError } from '@/utils/logger'; // Importar o logger

const passwordRules = "Ao menos 8 caracteres, letras maiúsculas, minúsculas, número e caractere especial";

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, "A senha deve conter pelo menos 8 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, passwordRules),
  confirmPassword: z.string().min(8, 'Confirmação de senha obrigatória'),
  terms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de serviço',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

enum RegistrationStep {
  FORM = 'form',
  PLAN = 'plan',
  CHECKOUT = 'checkout',
}

export const RegisterForm = () => {
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get('plan');
  
  const [userType, setUserType] = useState('company');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>(RegistrationStep.FORM);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialPlanId);
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const handleFormSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      if (userType === 'company') {
        // Para empresa, criar o usuário e ir para seleção de plano
        const { user, companyId } = await signUp(
          values.email, 
          values.password, 
          values.name, 
          userType === 'company'
        );
        
        if (user && companyId) {
          setCreatedCompanyId(companyId);
          // Se já veio com um plano da URL, pular direto para checkout
          if (selectedPlanId) {
            setRegistrationStep(RegistrationStep.CHECKOUT);
          } else {
            setRegistrationStep(RegistrationStep.PLAN);
          }
        }
      } else {
        // Para colaborador, registrar e ir para área de espera
        await signUp(
          values.email, 
          values.password, 
          values.name, 
          userType === 'company'
        );
        // O redirecionamento será tratado pelo AuthContext
      }
    } catch (error) {
      logError("Registration error:", error, { component: "RegisterForm" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlanId(planId);
    setRegistrationStep(RegistrationStep.CHECKOUT);
  };

  const handleBackToPlans = () => {
    setRegistrationStep(RegistrationStep.PLAN);
  };

  const handleSkipPayment = () => {
    toast.info("Redirecionando para o CRM. Você pode atualizar seu plano mais tarde.");
    // Redirecionamento para o CRM será tratado pelo AuthContext
  };

  // Mostrar diferentes conteúdos com base na etapa de registro
  if (registrationStep === RegistrationStep.PLAN) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-white"
            onClick={() => setRegistrationStep(RegistrationStep.FORM)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-white text-center flex-1">Escolha um plano</h2>
        </div>
        
        <PricingSection 
          onSelectPlan={handlePlanSelection} 
          selectedPlanId={selectedPlanId} 
        />
      </div>
    );
  }

  if (registrationStep === RegistrationStep.CHECKOUT) {
    if (!selectedPlanId || !createdCompanyId) {
      return <div>Erro ao processar pagamento. Plano ou empresa não encontrados.</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-white"
            onClick={handleBackToPlans}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-white text-center flex-1">Finalizar assinatura</h2>
        </div>
        
        <Checkout 
          planId={selectedPlanId} 
          companyId={createdCompanyId} 
          onBack={handleBackToPlans}
        />
        
        <div className="text-center mt-4">
          <Button
            variant="ghost" 
            className="text-primary hover:text-primary/80"
            onClick={handleSkipPayment}
          >
            Pular pagamento por enquanto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="company" className="w-full" onValueChange={setUserType}>
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/60">
        <TabsTrigger value="company" className="flex items-center gap-2 data-[state=active]:bg-primary">
          <Building2 className="h-4 w-4" />
          Empresa
        </TabsTrigger>
        <TabsTrigger value="collaborator" className="flex items-center gap-2 data-[state=active]:bg-primary">
          <User className="h-4 w-4" />
          Colaborador
        </TabsTrigger>
      </TabsList>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <TabsContent value="company">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Informe o nome da sua empresa" 
                        required 
                        {...field} 
                        className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        type="email" 
                        required 
                        {...field}
                        className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="collaborator">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Seu Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Informe seu nome completo" 
                        required 
                        {...field}
                        className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">E-mail</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        type="email" 
                        required 
                        {...field}
                        className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="••••••••" 
                      type={showPassword ? "text" : "password"}
                      required 
                      {...field}
                      className="bg-black/60 border-white/10 text-white placeholder:text-white/50 pr-10"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-xs text-white/50 mt-1">{passwordRules}</p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirmar Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="••••••••" 
                      type={showConfirmPassword ? "text" : "password"}
                      required 
                      {...field}
                      className="bg-black/60 border-white/10 text-white placeholder:text-white/50 pr-10"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-black/20">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white">
                    Concordo com os <a href="#" className="text-primary hover:underline">Termos de Serviço</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white group relative overflow-hidden"
            disabled={isSubmitting}
          >
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : userType === 'company' ? "Próximo: Escolha de Plano" : "Criar Conta"}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </form>
      </Form>
    </Tabs>
  );
};

