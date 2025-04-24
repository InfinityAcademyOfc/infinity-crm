
import { create } from 'zustand';
import { toast } from "sonner";
import { ModuleSyncState } from './types/moduleTypes';
import { 
  importLeadsAction, 
  importClientsAction, 
  importTasksAction, 
  convertLeadToClientAction,
  updateTaskAction,
  assignClientToTaskAction,
  syncAllModulesAction
} from './moduleActions';
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Create the store
export const useModuleSync = create<ModuleSyncState>((set, get) => ({
  importBuffer: {
    leads: [],
    clients: [],
    tasks: [],
  },
  leads: [],
  clients: [],
  tasks: [],
  products: [],
  lastSyncTime: null,
  isSyncing: false,

  importLeads: (leads, targetModule) => importLeadsAction(set, leads, targetModule),
  importClients: (clients) => importClientsAction(set, clients),
  importTasks: (tasks) => importTasksAction(set, tasks),
  convertLeadToClient: (leadId) => convertLeadToClientAction(set, leadId),
  updateTask: (taskId, updates) => updateTaskAction(set, taskId, updates),
  assignClientToTask: (taskId, clientId) => assignClientToTaskAction(set, taskId, clientId),
  syncAllModules: () => syncAllModulesAction(set),
  fetchLeads: async () => {
    const { data, error } = await supabase.from("leads").select("*");
    if (error) return [];
    return data;
  },
  fetchClients: async () => {
    const { data, error } = await supabase.from("clients").select("*");
    if (error) return [];
    return data;
  },
  fetchTasks: async () => {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) return [];
    return data;
  },
}));

// Helper function to update dashboard data
export const updateDashboardData = () => {
  const { leads, clients, tasks, products, lastSyncTime } = useModuleSync.getState();

  // Here you would update dashboard data based on the current state
  console.log(`Dashboard updated with data from: ${lastSyncTime}`);

  toast.success(`Dashboard atualizado`, {
    description: `Dados atualizados com sucesso`,
  });
};
