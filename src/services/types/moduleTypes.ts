
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
  title: string;
  description?: string;
  value?: number;
  assigned_to?: string;
  due_date?: string;
  priority: string;
  company_id: string;
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
  contact?: string;
  segment?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  company_id: string;
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
  assigned_to?: string;
  client_id?: string;
  start_date?: string;
  end_date?: string;
  company_id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  company_id: string;
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
