
import { Tables } from './types';

// Estendendo os tipos do Supabase com nossas definições personalizadas
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
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  participants: number;
  status: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

// Define tipos para as tabelas que serão criadas posteriormente
export type ExtendedTables = {
  companies: Tables<"companies">;
  profiles: Tables<"profiles">;
  tasks: Task;
  leads: Lead;
  clients: Client;
  meetings: Meeting;
}
