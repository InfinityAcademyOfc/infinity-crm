import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plan, PlanFeature, PlanWithFeatures, CompanySubscription } from "@/types/plan";

export const planService = {
  async getPlans(): Promise<Plan[]> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast.error("Erro ao carregar planos");
      return [];
    }
  },

  async getPlanFeatures(planId: string): Promise<PlanFeature[]> {
    try {
      const { data, error } = await supabase
        .from('plan_features')
        .select('*')
        .eq('plan_id', planId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error("Error fetching plan features:", error);
      return [];
    }
  },

  async getPlansWithFeatures(): Promise<PlanWithFeatures[]> {
    try {
      // Buscar todos os planos
      const { data: plans, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true })
        .eq('active', true);

      if (plansError) throw plansError;

      // Buscar características para os planos
      const plansWithFeatures: PlanWithFeatures[] = [];

      for (const plan of plans) {
        const { data: features, error: featuresError } = await supabase
          .from('plan_features')
          .select('*')
          .eq('plan_id', plan.id);

        if (featuresError) throw featuresError;
        
        plansWithFeatures.push({
          ...plan,
          features: features || []
        });
      }

      return plansWithFeatures;
    } catch (error) {
      console.error("Error fetching plans with features:", error);
      return [];
    }
  },

  async getPlanById(planId: string): Promise<PlanWithFeatures | null> {
    try {
      // Buscar um plano específico
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError) throw planError;

      // Buscar características do plano
      const { data: features, error: featuresError } = await supabase
        .from('plan_features')
        .select('*')
        .eq('plan_id', planId);

      if (featuresError) throw featuresError;
      
      return {
        ...plan,
        features: features || []
      };
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
      return null;
    }
  },

  async getCompanySubscription(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('company_subscriptions')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching company subscription:", error);
      return null;
    }
  },
  
  async createSubscription(companyId: string, planId: string): Promise<CompanySubscription | null> {
    try {
      const { data, error } = await supabase
        .from('company_subscriptions')
        .insert([
          { 
            company_id: companyId, 
            plan_id: planId,
            status: 'active',
            started_at: new Date().toISOString()
          }
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Assinatura criada com sucesso");
      return data;
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      toast.error("Erro ao criar assinatura");
      return null;
    }
  }
};
