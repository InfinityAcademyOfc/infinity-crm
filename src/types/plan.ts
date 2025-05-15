
export interface Plan {
  id: string;
  name: string;
  code: string;
  description: string | null;
  price: number;
  currency: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  id: string;
  plan_id: string;
  feature_key: string;
  feature_value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanySubscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PlanWithFeatures = Plan & {
  features: PlanFeature[];
};

export type PlanCode = 'free' | 'basic' | 'pro' | 'enterprise';
