
export interface Company {
  id: string;
  name: string;  
  email: string;
  phone?: string; // Added optional phone property
  avatar?: string; // Added optional avatar property
  department?: string; // Added optional department property
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone?: string; // Added optional phone property
  avatar?: string; // Added optional avatar property
  department?: string; // Added optional department property
  company_id?: string;
  subscription_id?: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}
