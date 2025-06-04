
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  avatar?: string | null;
  avatar_url?: string | null;
  tasksAssigned: number;
  tasksCompleted: number;
  company_id: string;
  created_at: string;
  updated_at: string;
}
