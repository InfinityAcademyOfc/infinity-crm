
export interface Profile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  avatar: string | null;
  avatar_url: string | null;
  status: string;
  company_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  company_id: string | null;
  subscription_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_id: string;
  settings: {
    company_name?: string;
    company_description?: string;
    business_type?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
    preferences?: {
      timezone?: string;
      currency?: string;
      language?: string;
    };
  };
  created_at: string;
  updated_at: string;
}
