
export interface Task {
  id: string;
  title: string;
  description?: string;
  client?: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  priority?: string;
  completion: number;
  company_id: string;
  created_at: string;
  updated_at: string;
}
