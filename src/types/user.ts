
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  avatar?: string;
  status: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'admin' | 'user';
