
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low' | null;
  assigned_to?: string | null;
  client_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  completion?: number | null;
  company_id: string;
  created_at: string;
  updated_at: string;
}
