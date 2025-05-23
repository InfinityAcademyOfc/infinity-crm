
export interface UserSettings {
  id?: string;
  user_id: string;
  company_id?: string | null;
  theme: string;
  notifications_enabled: boolean;
  language: string;
  updated_at?: string;
  created_at?: string;
  dashboard_config?: DashboardConfig | null;
}

export interface NotificationSettings {
  new_leads: boolean;
  client_activities: boolean;
  payments: boolean;
  meeting_reminders: boolean;
  email_alerts: boolean;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  last_password_change?: string | null;
}

export interface AutomationRule {
  id: string;
  condition: {
    field: string;
    operator: string;
    value: string;
  };
  action: {
    type: string;
    value: string;
  };
}

export interface DashboardConfig {
  charts: Array<{
    id: string;
    title: string;
    enabled: boolean;
    type: string;
    order: number;
  }>;
}
