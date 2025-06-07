
export interface Lead {
  id: string;
  title: string;
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  value?: number;
  source?: string;
  assigned_to?: string;
  due_date?: string;
  priority: string;
  status: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}
