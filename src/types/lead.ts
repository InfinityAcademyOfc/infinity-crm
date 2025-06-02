
export interface Lead {
  id: string;
  title: string;
  name: string;
  email: string | null;
  phone: string | null;
  description: string | null;
  source: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number | null;
  assigned_to: string | null;
  due_date: string | null;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  created_by: string | null;
  created_at: string;
}

export interface CreateLeadData {
  title: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  source?: string;
  priority?: 'low' | 'medium' | 'high';
  value?: number;
  assigned_to?: string;
  due_date?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
}
