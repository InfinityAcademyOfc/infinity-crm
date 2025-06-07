
export interface Company {
  id: string;
  name: string;  
  email: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  company_id?: string;
  subscription_id?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}
