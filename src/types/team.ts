
export interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  avatar: string | null;
  status: string;
  company_id: string | null;
  created_at: string;
  updated_at: string;
  tasksAssigned?: number;
  tasksCompleted?: number;
}
