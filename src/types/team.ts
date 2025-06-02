
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  avatar?: string;
  tasksAssigned: number;
  tasksCompleted: number;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status?: 'active' | 'inactive';
  avatar?: string;
}

export interface UpdateTeamMemberData extends Partial<CreateTeamMemberData> {
  tasksAssigned?: number;
  tasksCompleted?: number;
}
