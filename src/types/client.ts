
export interface Client {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  segment?: string;
  status: string;
  last_contact?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  company?: string; // Legacy field, keeping for compatibility
  // Analytics fields for UI components
  nps?: number;
  ltv?: number;
}
