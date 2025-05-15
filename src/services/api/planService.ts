
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
      // First get all plans
      const plans = await this.getPlans();
      
      // Then fetch features for each plan
      const plansWithFeatures = await Promise.all(
        plans.map(async (plan) => {
          const features = await this.getPlanFeatures(plan.id);
          return {
            ...plan,
            features
          };
        })
      );

      return plansWithFeatures;
    } catch (error: any) {
      console.error("Error fetching plans with features:", error);
      toast.error("Erro ao carregar detalhes dos planos");
      return [];
    }
  },

  async getCompanySubscription(companyId: string): Promise<CompanySubscription | null> {
    try {
      const { data, error } = await supabase
        .from('company_subscriptions')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error fetching company subscription:", error);
      toast.error("Erro ao carregar assinatura da empresa");
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
