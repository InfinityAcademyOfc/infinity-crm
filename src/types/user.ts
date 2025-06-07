
import { Database } from "@/integrations/supabase/types";

export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  avatar?: string | null; // Adding this for backward compatibility
  role?: string;
  status?: string;
  company_id?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Type for client-side use, with user preferences and settings
export interface ExtendedProfile extends UserProfile {
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
  last_active?: string;
  display_name?: string;
}

// Type specifically for form handling
export interface ProfileFormData {
  name: string;
  email: string;
  avatar_url?: string;
  display_name?: string;
  phone?: string;
}
