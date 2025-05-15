
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

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
