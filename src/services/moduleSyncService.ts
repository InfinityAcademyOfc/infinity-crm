
import { create } from 'zustand';
import { toast } from "sonner";
import { ModuleSyncState } from './types/moduleTypes';
import { supabase } from "@/integrations/supabase/client";
import { 
  importLeadsAction, 
  importClientsAction, 
  importTasksAction, 
  convertLeadToClientAction,
  updateTaskAction,
  assignClientToTaskAction,
  syncAllModulesAction
} from './moduleActions';

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
  convertLeadToClient: (leadId) => convertLeadToClientAction(set, get, leadId),
  updateTask: (taskId, updates) => updateTaskAction(set, taskId, updates),
  assignClientToTask: (taskId, clientId) => assignClientToTaskAction(set, get, taskId, clientId),
  syncAllModules: () => syncAllModulesAction(set, get),
  
  fetchLeads: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) {
        console.error("Erro ao buscar leads:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      return [];
    }
  },
  
  fetchClients: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) {
        console.error("Erro ao buscar clientes:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      return [];
    }
  },
  
  fetchTasks: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) {
        console.error("Erro ao buscar tarefas:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      return [];
    }
  },
  
  fetchProducts: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', companyId);
        
      if (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }
  }
}));

// Helper function to update dashboard data
export const updateDashboardData = async (companyId: string) => {
  if (!companyId) {
    console.error("ID da empresa não fornecido");
    return;
  }
  
  const moduleSync = useModuleSync.getState();
  
  try {
    const leads = await moduleSync.fetchLeads(companyId);
    const clients = await moduleSync.fetchClients(companyId);
    const tasks = await moduleSync.fetchTasks(companyId);
    const products = await moduleSync.fetchProducts(companyId);
    
    useModuleSync.setState({
      leads,
      clients,
      tasks,
      products,
      lastSyncTime: new Date().toISOString()
    });
    
    console.log(`Dashboard atualizado com dados em: ${new Date().toISOString()}`);
    
    toast.success(`Dashboard atualizado`, {
      description: `Dados atualizados com sucesso`,
    });
    
    return { leads, clients, tasks, products };
  } catch (error) {
    console.error("Erro ao atualizar dados do dashboard:", error);
    toast.error("Erro ao atualizar dados do dashboard");
    throw error;
  }
};
