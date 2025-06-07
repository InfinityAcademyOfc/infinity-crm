
import { createClient } from '@supabase/supabase-js';

// Configuração correta do Supabase
const supabaseUrl = 'https://pfzbtienafbyvzspgtlo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmemJ0aWVuYWZieXZ6c3BndGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzAwMTIsImV4cCI6MjA2MTEwNjAxMn0.DTmnnR59UqNrKq1bzSLlXHFHjuhTooOVO_arN3jimeY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});
