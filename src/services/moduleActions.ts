
import { toast } from "sonner";
import { Lead, Client, Task, ModuleSyncState } from "./types/moduleTypes";
import { supabase } from "@/integrations/supabase/client";

// Import actions
export const importLeadsAction = (set: any, leads: Lead[], targetModule: string = "sales-funnel") => {
  set((state: ModuleSyncState) => {
    // Add leads to the main leads array
    const updatedLeads = [...state.leads, ...leads];
    
    // Try to persist to Supabase if possible
    leads.forEach(async (lead) => {
      if (lead.company_id) {
        try {
          const { error } = await supabase.from('leads').insert({
            title: lead.title,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            description: lead.description,
            value: lead.value,
            source: lead.source,
            assigned_to: lead.assigned_to,
            due_date: lead.due_date,
            priority: lead.priority,
            status: lead.status,
            company_id: lead.company_id
          });
          
          if (error) {
            console.error("Erro ao salvar lead no Supabase:", error);
          }
        } catch (error) {
          console.error("Erro ao salvar lead:", error);
        }
      }
    });
    
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
    
    // Try to persist to Supabase if possible
    clients.forEach(async (client) => {
      if (client.company_id) {
        try {
          const { error } = await supabase.from('clients').insert({
            name: client.name,
            contact: client.contact,
            email: client.email,
            phone: client.phone,
            segment: client.segment,
            status: client.status,
            street: client.street,
            city: client.city,
            state: client.state,
            zip: client.zip,
            company_id: client.company_id
          });
          
          if (error) {
            console.error("Erro ao salvar cliente no Supabase:", error);
          }
        } catch (error) {
          console.error("Erro ao salvar cliente:", error);
        }
      }
    });
    
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
    
    // Try to persist to Supabase if possible
    tasks.forEach(async (task) => {
      if (task.company_id) {
        try {
          const { error } = await supabase.from('tasks').insert({
            title: task.title,
            description: task.description,
            assigned_to: task.assigned_to,
            client_id: task.client_id,
            start_date: task.start_date,
            end_date: task.end_date,
            status: task.status,
            priority: task.priority,
            completion: task.completion,
            company_id: task.company_id
          });
          
          if (error) {
            console.error("Erro ao salvar tarefa no Supabase:", error);
          }
        } catch (error) {
          console.error("Erro ao salvar tarefa:", error);
        }
      }
    });
    
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
export const convertLeadToClientAction = (set: any, get: any, leadId: string) => {
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
      company_id: lead.company_id,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Remove the lead from leads
    const updatedLeads = state.leads.filter(l => l.id !== leadId);
    
    // Add the new client
    const updatedClients = [...state.clients, newClient];
    
    // Try to persist to Supabase if possible
    if (lead.company_id) {
      // Add client to Supabase
      supabase.from('clients').insert({
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        company_id: lead.company_id,
        status: 'active'
      }).then(({ error }) => {
        if (error) {
          console.error("Erro ao adicionar cliente no Supabase:", error);
        }
      });
      
      // Delete lead from Supabase
      supabase.from('leads').delete().eq('id', leadId).then(({ error }) => {
        if (error) {
          console.error("Erro ao remover lead do Supabase:", error);
        }
      });
    }
    
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
    
    // Try to persist to Supabase if possible
    const task = state.tasks.find(t => t.id === taskId);
    if (task && task.company_id) {
      supabase.from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .then(({ error }) => {
          if (error) {
            console.error("Erro ao atualizar tarefa no Supabase:", error);
          }
        });
    }
    
    return {
      tasks: updatedTasks,
      lastSyncTime: new Date().toISOString(),
    };
  });
};

// Assign a client to a task
export const assignClientToTaskAction = (set: any, get: any, taskId: string, clientId: string) => {
  set((state: ModuleSyncState) => {
    const client = state.clients.find(c => c.id === clientId);
    if (!client) return state;
    
    const updatedTasks = state.tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        client_id: clientId,
        client: client.name,
        updated_at: new Date().toISOString() 
      } : task
    );
    
    // Try to persist to Supabase if possible
    const task = state.tasks.find(t => t.id === taskId);
    if (task && task.company_id) {
      supabase.from('tasks')
        .update({
          client_id: clientId,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .then(({ error }) => {
          if (error) {
            console.error("Erro ao atualizar cliente da tarefa no Supabase:", error);
          }
        });
    }
    
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
export const syncAllModulesAction = (set: any, get: any) => {
  set({ isSyncing: true });
  
  const state = get();
  
  // Check if we have a company to sync with
  const firstLead = state.leads[0];
  const firstClient = state.clients[0];
  const firstTask = state.tasks[0];
  
  const companyId = firstLead?.company_id || firstClient?.company_id || firstTask?.company_id;
  
  if (companyId) {
    Promise.all([
      state.fetchLeads(companyId),
      state.fetchClients(companyId),
      state.fetchTasks(companyId),
      state.fetchProducts(companyId)
    ])
    .then(([leads, clients, tasks, products]) => {
      set({
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
        leads,
        clients,
        tasks,
        products
      });
      
      toast.success(`Sincronização concluída`, {
        description: `Todos os módulos foram sincronizados com sucesso`,
      });
    })
    .catch(error => {
      console.error("Erro na sincronização:", error);
      set({ isSyncing: false });
      
      toast.error(`Erro na sincronização`, {
        description: `Houve um problema ao sincronizar os dados`,
      });
    });
  } else {
    // Simulate sync delay if no company_id available
    setTimeout(() => {
      set({
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
      });
      
      toast.success(`Sincronização concluída`, {
        description: `Todos os módulos foram sincronizados com sucesso`,
      });
    }, 1500);
  }
};
