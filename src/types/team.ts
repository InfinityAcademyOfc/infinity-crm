
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  status: string;
  tasksAssigned: number;
  tasksCompleted: number;
  joinedDate?: string;
}

export interface DepartmentNode {
  id: string;
  name: string;
  members: TeamMember[];
  children: DepartmentNode[];
  expanded?: boolean;
}
