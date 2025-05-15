
import { toast } from "sonner";
import { Lead, Client, Task, ModuleSyncState } from "./types/moduleTypes";

// Import actions
export const importLeadsAction = (set: any, leads: Lead[], targetModule: string = "sales-funnel") => {
  set((state: ModuleSyncState) => {
    // Add leads to the main leads array
    const updatedLeads = [...state.leads, ...leads];
    
    // Notify user
    toast.success(`${leads.length} leads importados com sucesso`, {
      description: `Os leads foram adicionados ao módulo ${targetModule === "sales-funnel" ? "Funil de Vendas" : targetModule}`,
    });
    
    return {
      leads: updatedLeads,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Import clients
export const importClientsAction = (set: any, clients: Client[]) => {
  set((state: ModuleSyncState) => {
    const updatedClients = [...state.clients, ...clients];
    
    toast.success(`${clients.length} clientes importados com sucesso`, {
      description: "Os clientes foram adicionados ao módulo Clientes",
    });
    
    return {
      clients: updatedClients,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Import tasks
export const importTasksAction = (set: any, tasks: Task[]) => {
  set((state: ModuleSyncState) => {
    const updatedTasks = [...state.tasks, ...tasks];
    
    toast.success(`${tasks.length} tarefas importadas com sucesso`, {
      description: "As tarefas foram adicionadas ao módulo Produção",
    });
    
    return {
      tasks: updatedTasks,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Convert a lead to a client
export const convertLeadToClientAction = (set: any, leadId: string) => {
  set((state: ModuleSyncState) => {
    // Find the lead
    const lead = state.leads.find(l => l.id === leadId);
    if (!lead) return state;
    
    // Create a new client from the lead data
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: '',
      status: 'new',
      source: lead.source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Remove the lead from leads
    const updatedLeads = state.leads.filter(l => l.id !== leadId);
    
    // Add the new client
    const updatedClients = [...state.clients, newClient];
    
    toast.success(`Lead convertido em cliente`, {
      description: `${lead.name} foi convertido em cliente com sucesso`,
    });
    
    return {
      leads: updatedLeads,
      clients: updatedClients,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Update a task
export const updateTaskAction = (set: any, taskId: string, updates: Partial<Task>) => {
  set((state: ModuleSyncState) => {
    const updatedTasks = state.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    );
    
    return {
      tasks: updatedTasks,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Assign a client to a task
export const assignClientToTaskAction = (set: any, taskId: string, clientId: string) => {
  set((state: ModuleSyncState) => {
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return state;
    
    const updatedTasks = state.tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        client: client.name,
        updatedAt: new Date().toISOString() 
      } : task
    );
    
    toast.success(`Cliente atribuído à tarefa`, {
      description: `${client.name} foi atribuído à tarefa com sucesso`,
    });
    
    return {
      tasks: updatedTasks,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Synchronize all modules
export const syncAllModulesAction = (set: any) => {
  set({ isSyncing: true });
  
  // Simulate sync delay
  setTimeout(() => {
    set((state: ModuleSyncState) => {
      toast.success(`Sincronização concluída`, {
        description: `Todos os módulos foram sincronizados com sucesso`,
      });
      
      return {
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
      };
    });
  }, 1500);
};
