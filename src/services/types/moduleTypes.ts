
// Types for the different module data
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  client?: string;
  completion?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleSyncState {
  // Imported data waiting to be distributed
  importBuffer: {
    leads: Lead[];
    clients: Client[];
    tasks: Task[];
  };
  
  // Module-specific data
  leads: Lead[];
  clients: Client[];
  tasks: Task[];
  products: Product[];
  
  // Sync status
  lastSyncTime: string | null;
  isSyncing: boolean;
  
  // Actions
  importLeads: (leads: Lead[], targetModule?: string) => void;
  importClients: (clients: Client[]) => void;
  importTasks: (tasks: Task[]) => void;
  convertLeadToClient: (leadId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  assignClientToTask: (taskId: string, clientId: string) => void;
  syncAllModules: () => void;
}
