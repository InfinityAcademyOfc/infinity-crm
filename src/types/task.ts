
export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  client_id?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  priority?: string;
  completion: number;
  company_id: string;
  created_at: string;
  updated_at: string;
  client?: string; // Legacy field, keeping for compatibility
}
