
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  position?: string;
  team?: string;
  avatar: string;
  status: string;
  tasksAssigned: number;
  tasksCompleted: number;
  joinedDate?: string;
  hire_date?: string;
  salary?: number;
  manager_id?: string;
}

export interface DepartmentNode {
  id: string;
  name: string;
  members: TeamMember[];
  children: DepartmentNode[];
  expanded?: boolean;
  level?: number;
}

export interface TeamHierarchy {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position?: string;
  manager_id?: string;
  manager_name?: string;
  level: number;
}

export interface ProductionProject {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
  progress: number;
  project_manager_id?: string | null;
  team_members: string[];
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}
