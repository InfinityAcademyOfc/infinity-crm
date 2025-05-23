
import { createClient } from '@supabase/supabase-js';

// Usando os valores do ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pfzbtienafbyvzspgtlo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmemJ0aWVuYWZieXZ6c3BndGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzAwMTIsImV4cCI6MjA2MTEwNjAxMn0.DTmnnR59UqNrKq1bzSLlXHFHjuhTooOVO_arN3jimeY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
