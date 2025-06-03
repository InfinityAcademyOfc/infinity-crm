
import React from "react";
import ReactDOM from "react-dom/client";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import "./styles/kanban.css";
import "./styles/dashboard.css"; 
import "./styles/scrollbars.css";
import "./styles/whatsapp.css";
import "./styles/navigation.css";

const supabase = createClient(
  'https://pfzbtienafbyvzspgtlo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmemJ0aWVuYWZieXZ6c3BndGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzAwMTIsImV4cCI6MjA2MTEwNjAxMn0.DTmnnR59UqNrKq1bzSLlXHFHjuhTooOVO_arN3jimeY'
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SessionContextProvider>
  </React.StrictMode>
);
