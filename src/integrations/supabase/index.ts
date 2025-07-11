
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://pfzbtienafbyvzspgtlo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmemJ0aWVuYWZieXZ6c3BndGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzAwMTIsImV4cCI6MjA2MTEwNjAxMn0.DTmnnR59UqNrKq1bzSLlXHFHjuhTooOVO_arN3jimeY";

// Cliente unificado do Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export default supabase;
