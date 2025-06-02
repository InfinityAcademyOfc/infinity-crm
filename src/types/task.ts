
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | null;
  assigned_to: string | null;
  client_id: string | null;
  start_date: string | null;
  end_date: string | null;
  completion: number;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  client_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  completion?: number;
}
