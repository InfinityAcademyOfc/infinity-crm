
import { UserProfile } from './user';
import { Client } from './client';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  client_id?: string;
  client?: Client;
  start_date?: string;
  end_date?: string;
  status: string;
  priority?: string;
  completion: number;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskWithAssignee extends Task {
  assignee?: UserProfile;
}
