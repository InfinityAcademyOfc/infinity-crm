
// Types for the different module data
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  title: string;
  description?: string;
  value?: number;
  assigned_to?: string;
  due_date?: string;
  priority: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  source?: string;
  contact?: string;
  segment?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  company_id: string;
  last_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string; // Compatibility field
  status: string;
  priority?: string;
  dueDate?: string; // Compatibility field
  assigned_to?: string;
  client_id?: string;
  start_date?: string;
  end_date?: string;
  completion?: number;
  company_id: string;
  client?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  company_id: string;
  created_at: string;
  updated_at: string;
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
  
  // Fetch methods
  fetchLeads: (companyId: string) => Promise<Lead[]>;
  fetchClients: (companyId: string) => Promise<Client[]>;
  fetchTasks: (companyId: string) => Promise<Task[]>;
  fetchProducts: (companyId: string) => Promise<Product[]>;
}
