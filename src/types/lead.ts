
export interface Lead {
  id: string;
  title: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  description?: string | null;
  source?: string | null;
  value?: number | null;
  assigned_to?: string | null;
  due_date?: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  company_id: string;
  created_at: string;
  updated_at: string;
}
