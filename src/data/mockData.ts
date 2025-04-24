export const mockLeads = [
  {
    id: "1",
    title: "Empresa ABC Ltda.",
    description: "Interessada em implementar sistema ERP",
    value: 25000,
    assignedTo: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg"
    },
    dueDate: "2023-12-20",
    priority: "high" as "high", // Type cast to ensure it matches the enum
    tags: [
      { label: "ERP", color: "bg-blue-100 text-blue-800" },
      { label: "Software", color: "bg-purple-100 text-purple-800" }
    ]
  },
  {
    id: "2",
    title: "Consultoria XYZ",
    description: "Projeto de consultoria para redesenho de processos",
    value: 15000,
    assignedTo: {
      name: "Ana Oliveira",
      avatar: "/placeholder.svg"
    },
    dueDate: "2023-12-15",
    priority: "medium" as "medium",
    tags: [
      { label: "Consultoria", color: "bg-yellow-100 text-yellow-800" }
    ]
  },
  {
    id: "3",
    title: "Startup Tech",
    description: "Desenvolvimento de aplicativo mobile",
    value: 32000,
    assignedTo: {
      name: "Paulo Santos",
      avatar: "/placeholder.svg"
    },
    dueDate: "2024-01-10",
    priority: "high" as "high",
    tags: [
      { label: "Mobile", color: "bg-green-100 text-green-800" },
      { label: "Desenvolvimento", color: "bg-blue-100 text-blue-800" }
    ]
  },
  {
    id: "4",
    title: "Distribuidora Central",
    description: "Implementação de sistema de logística",
    value: 18500,
    assignedTo: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg"
    },
    dueDate: "2023-12-30",
    priority: "low" as "low",
    tags: [
      { label: "Logística", color: "bg-orange-100 text-orange-800" }
    ]
  },
  {
    id: "5",
    title: "Indústria Nacional",
    description: "Automação de linha de produção",
    value: 75000,
    assignedTo: {
      name: "Ana Oliveira",
      avatar: "/placeholder.svg"
    },
    dueDate: "2024-02-15",
    priority: "medium" as "medium",
    tags: [
      { label: "Automação", color: "bg-red-100 text-red-800" },
      { label: "Indústria", color: "bg-gray-100 text-gray-800" }
    ]
  },
  {
    id: "6",
    title: "Escola Futuro",
    description: "Sistema de gestão escolar completo",
    value: 22000,
    assignedTo: {
      name: "Paulo Santos",
      avatar: "/placeholder.svg"
    },
    dueDate: "2024-01-20",
    priority: "medium" as "medium",
    tags: [
      { label: "Educação", color: "bg-indigo-100 text-indigo-800" }
    ]
  },
  {
    id: "7",
    title: "Hospital Central",
    description: "Modernização de sistema de agendamento",
    value: 45000,
    assignedTo: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg"
    },
    dueDate: "2024-03-10",
    priority: "high" as "high",
    tags: [
      { label: "Saúde", color: "bg-pink-100 text-pink-800" }
    ]
  }
];

export const mockClients = [
  {
    id: "1",
    name: "Empresa ABC Ltda.",
    contact: "João Silva",
    email: "joao@empresaabc.com.br",
    phone: "11999887766",
    segment: "Tecnologia",
    status: "Ativo",
    lastContact: "2023-12-01",
    address: {
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zip: "01310-100"
    },
    createdAt: "2023-01-15"
  },
  {
    id: "2",
    name: "Consultoria XYZ",
    contact: "Maria Santos",
    email: "maria@consultoriaxyz.com.br",
    phone: "11988776655",
    segment: "Consultoria",
    status: "Ativo",
    lastContact: "2023-11-28",
    address: {
      street: "Rua Augusta, 500",
      city: "São Paulo",
      state: "SP",
      zip: "01304-000"
    },
    createdAt: "2023-03-22"
  },
  {
    id: "3",
    name: "Indústria Nacional",
    contact: "Pedro Oliveira",
    email: "pedro@industrianacional.com.br",
    phone: "11977665544",
    segment: "Manufatura",
    status: "Inativo",
    lastContact: "2023-10-15",
    address: {
      street: "Av. Industrial, 2000",
      city: "São Bernardo do Campo",
      state: "SP",
      zip: "09720-000"
    },
    createdAt: "2022-11-10"
  },
  {
    id: "4",
    name: "Distribuidora Central",
    contact: "Ana Costa",
    email: "ana@distribuidoracentral.com.br",
    phone: "11966554433",
    segment: "Distribuição",
    status: "Ativo",
    lastContact: "2023-11-20",
    address: {
      street: "Rodovia Anhanguera, km 30",
      city: "Osasco",
      state: "SP",
      zip: "06000-000"
    },
    createdAt: "2023-05-05"
  },
  {
    id: "5",
    name: "Escola Futuro",
    contact: "Roberto Martins",
    email: "roberto@escolafuturo.com.br",
    phone: "11955443322",
    segment: "Educação",
    status: "Ativo",
    lastContact: "2023-11-30",
    address: {
      street: "Rua dos Professores, 100",
      city: "Guarulhos",
      state: "SP",
      zip: "07000-000"
    },
    createdAt: "2023-02-18"
  }
];

export const mockTransactions = [
  {
    id: "1",
    type: "income",
    description: "Pagamento Empresa ABC",
    amount: 25000,
    date: "2023-12-05",
    category: "Vendas",
    client: "Empresa ABC Ltda.",
    status: "completed",
    notes: "Pagamento referente ao projeto de implementação ERP"
  },
  {
    id: "2",
    type: "expense",
    description: "Aluguel Escritório",
    amount: 3500,
    date: "2023-12-01",
    category: "Infraestrutura",
    client: null,
    status: "completed",
    notes: "Pagamento mensal"
  },
  {
    id: "3",
    type: "expense",
    description: "Salários",
    amount: 32000,
    date: "2023-12-05",
    category: "Pessoal",
    client: null,
    status: "completed",
    notes: "Folha de pagamento mensal"
  },
  {
    id: "4",
    type: "income",
    description: "Consultoria XYZ - Parcela 1",
    amount: 7500,
    date: "2023-12-10",
    category: "Consultoria",
    client: "Consultoria XYZ",
    status: "pending",
    notes: "Primeira parcela do projeto de redesenho de processos"
  },
  {
    id: "5",
    type: "expense",
    description: "Marketing Digital",
    amount: 2500,
    date: "2023-12-02",
    category: "Marketing",
    client: null,
    status: "completed",
    notes: "Campanha mensal Google Ads"
  },
  {
    id: "6",
    type: "income",
    description: "Manutenção Mensal",
    amount: 3800,
    date: "2023-12-07",
    category: "Serviços",
    client: "Indústria Nacional",
    status: "completed",
    notes: "Mensalidade de suporte e manutenção"
  }
];

export const mockProducts = [
  {
    id: "1",
    name: "Sistema ERP Completo",
    category: "Software",
    price: 25000,
    recurrence: "one-time",
    stock: null,
    description: "Sistema integrado de gestão empresarial com módulos para todos os departamentos."
  },
  {
    id: "2",
    name: "Licença CRM",
    category: "Software",
    price: 4500,
    recurrence: "yearly",
    stock: null,
    description: "Licença anual para software de gestão de relacionamento com o cliente."
  },
  {
    id: "3",
    name: "Consultoria Estratégica",
    category: "Serviço",
    price: 15000,
    recurrence: "one-time",
    stock: null,
    description: "Análise e consultoria para redesenho de processos e estratégia empresarial."
  },
  {
    id: "4",
    name: "Desenvolvimento Mobile",
    category: "Serviço",
    price: 32000,
    recurrence: "one-time",
    stock: null,
    description: "Desenvolvimento de aplicativo mobile personalizado para Android e iOS."
  },
  {
    id: "5",
    name: "Plano de Suporte Premium",
    category: "Serviço",
    price: 2500,
    recurrence: "monthly",
    stock: null,
    description: "Atendimento prioritário 24/7 com SLA garantido."
  },
  {
    id: "6",
    name: "Treinamento ERP",
    category: "Serviço",
    price: 5000,
    recurrence: "one-time",
    stock: null,
    description: "Treinamento presencial para equipe sobre uso do sistema ERP."
  }
];

// Update the tasks data to match the updated KanbanCardItem interface
export const mockTasks = [
  {
    id: "1",
    title: "Implementação do ERP para Empresa ABC",
    description: "Configuração inicial e migração de dados",
    client: "Empresa ABC Ltda.",
    assignedTo: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg"
    },
    startDate: "2023-12-15",
    endDate: "2024-01-15",
    status: "in-progress",
    priority: "high" as "high",
    completion: 30
  },
  {
    id: "2",
    title: "Consultoria de Processos XYZ",
    description: "Análise e mapeamento de processos atuais",
    client: "Consultoria XYZ",
    assignedTo: {
      name: "Ana Oliveira",
      avatar: "/placeholder.svg"
    },
    startDate: "2023-12-10",
    endDate: "2023-12-30",
    status: "in-progress",
    priority: "medium" as "medium",
    completion: 50
  },
  {
    id: "3",
    title: "Desenvolvimento App Mobile Startup",
    description: "Fase de UX/UI Design",
    client: "Startup Tech",
    assignedTo: {
      name: "Paulo Santos",
      avatar: "/placeholder.svg"
    },
    startDate: "2024-01-05",
    endDate: "2024-01-20",
    status: "not-started",
    priority: "high" as "high",
    completion: 0
  },
  {
    id: "4",
    title: "Configuração Logística Distribuidora",
    description: "Parametrização do sistema de controle de estoque",
    client: "Distribuidora Central",
    assignedTo: {
      name: "Carlos Silva",
      avatar: "/placeholder.svg"
    },
    startDate: "2023-12-20",
    endDate: "2024-01-10",
    status: "not-started",
    priority: "medium" as "medium",
    completion: 0
  },
  {
    id: "5",
    title: "Treinamento ERP para Empresa ABC",
    description: "Preparação de material e realização de treinamento para usuários-chave",
    client: "Empresa ABC Ltda.",
    assignedTo: {
      name: "Ana Oliveira",
      avatar: "/placeholder.svg"
    },
    startDate: "2024-01-20",
    endDate: "2024-01-25",
    status: "not-started",
    priority: "low" as "low",
    completion: 0
  }
];

export const mockTeamMembers = [
  {
    id: "1",
    name: "Carlos Silva",
    email: "carlos@infinitycrm.com",
    phone: "11999887766",
    role: "Consultor",
    department: "Implementação",
    status: "active",
    tasksAssigned: 10,
    tasksCompleted: 7,
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Ana Oliveira",
    email: "ana@infinitycrm.com",
    phone: "11988776655",
    role: "Analista de Processos",
    department: "Consultoria",
    status: "active",
    tasksAssigned: 8,
    tasksCompleted: 5,
    avatar: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Paulo Santos",
    email: "paulo@infinitycrm.com",
    phone: "11977665544",
    role: "Desenvolvedor",
    department: "Tecnologia",
    status: "active",
    tasksAssigned: 12,
    tasksCompleted: 9,
    avatar: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Mariana Costa",
    email: "mariana@infinitycrm.com",
    phone: "11966554433",
    role: "Vendedora",
    department: "Comercial",
    status: "active",
    tasksAssigned: 6,
    tasksCompleted: 4,
    avatar: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Roberto Almeida",
    email: "roberto@infinitycrm.com",
    phone: "11955443322",
    role: "Gerente de Projetos",
    department: "Projetos",
    status: "inactive",
    tasksAssigned: 15,
    tasksCompleted: 12,
    avatar: "/placeholder.svg"
  }
];

export const mockMeetings = [
  {
    id: "1",
    title: "Kick-off Projeto ABC",
    description: "Reunião inicial para definição do escopo e cronograma",
    client: "Empresa ABC Ltda.",
    participants: ["Carlos Silva", "Ana Oliveira", "João Silva"],
    date: "2023-12-15T14:00:00",
    duration: 60,
    link: "https://meet.google.com/abc-defg-hij",
    status: "scheduled"
  },
  {
    id: "2",
    title: "Apresentação de Requisitos",
    description: "Levantamento detalhado dos requisitos do projeto",
    client: "Consultoria XYZ",
    participants: ["Ana Oliveira", "Maria Santos"],
    date: "2023-12-18T10:00:00",
    duration: 90,
    link: "https://meet.google.com/klm-nopq-rst",
    status: "scheduled"
  },
  {
    id: "3",
    title: "Status Report Mensal",
    description: "Apresentação do andamento do projeto",
    client: "Indústria Nacional",
    participants: ["Carlos Silva", "Paulo Santos", "Pedro Oliveira"],
    date: "2023-12-10T15:30:00",
    duration: 45,
    link: "https://meet.google.com/uvw-xyza-bcd",
    status: "completed"
  },
  {
    id: "4",
    title: "Demonstração do Sistema",
    description: "Apresentação dos módulos já implementados",
    client: "Distribuidora Central",
    participants: ["Paulo Santos", "Ana Costa"],
    date: "2023-12-22T11:00:00",
    duration: 60,
    link: "https://meet.google.com/efg-hijk-lmn",
    status: "scheduled"
  },
  {
    id: "5",
    title: "Treinamento Inicial",
    description: "Primeira sessão de treinamento para usuários-chave",
    client: "Escola Futuro",
    participants: ["Ana Oliveira", "Roberto Martins"],
    date: "2023-12-08T09:00:00",
    duration: 120,
    link: "https://meet.google.com/opq-rstu-vwx",
    status: "completed"
  }
];

export const mockKanbanColumns = [
  {
    id: "prospecting",
    title: "Prospecção",
    color: "bg-gray-400",
    cards: [
      mockLeads[2],
      mockLeads[4],
    ]
  },
  {
    id: "qualification",
    title: "Qualificação",
    color: "bg-blue-400",
    cards: [
      mockLeads[1],
      mockLeads[5],
    ]
  },
  {
    id: "proposal",
    title: "Proposta",
    color: "bg-yellow-400",
    cards: [
      mockLeads[0],
      mockLeads[6],
    ]
  },
  {
    id: "negotiation",
    title: "Negociação",
    color: "bg-orange-400",
    cards: [
      mockLeads[3],
    ]
  },
  {
    id: "closed",
    title: "Fechado",
    color: "bg-green-400",
    cards: []
  }
];

export const mockTasksKanbanColumns = [
  {
    id: "backlog",
    title: "Backlog",
    color: "bg-gray-400",
    cards: [
      mockTasks[2],
      mockTasks[4],
    ]
  },
  {
    id: "todo",
    title: "A Fazer",
    color: "bg-blue-400",
    cards: [
      mockTasks[3],
    ]
  },
  {
    id: "in-progress",
    title: "Em Progresso",
    color: "bg-yellow-400",
    cards: [
      mockTasks[0],
      mockTasks[1],
    ]
  },
  {
    id: "review",
    title: "Revisão",
    color: "bg-purple-400",
    cards: []
  },
  {
    id: "done",
    title: "Concluído",
    color: "bg-green-400",
    cards: []
  }
];

export const mockSalesData = [
  { month: "Jan", value: 45000 },
  { month: "Fev", value: 52000 },
  { month: "Mar", value: 48000 },
  { month: "Abr", value: 61000 },
  { month: "Mai", value: 55000 },
  { month: "Jun", value: 67000 },
  { month: "Jul", value: 72000 },
  { month: "Ago", value: 78000 },
  { month: "Set", value: 74000 },
  { month: "Out", value: 82000 },
  { month: "Nov", value: 85000 },
  { month: "Dez", value: 91000 }
];

export const mockFunnelData = [
  { name: "Prospecção", value: 120 },
  { name: "Qualificação", value: 80 },
  { name: "Proposta", value: 50 },
  { name: "Negociação", value: 30 },
  { name: "Fechado", value: 20 }
];

export interface Activity {
  id: string;
  type: 'task' | 'meeting' | 'deadline' | 'note';
  title: string;
  time?: string;
  status?: 'pending' | 'completed' | 'overdue';
  priority?: 'low' | 'medium' | 'high';
  relatedTo?: string;
}

export const mockTodayActivities: Activity[] = [
  {
    id: '1',
    type: 'task',
    title: 'Enviar proposta para Empresa ABC',
    time: '10:00',
    status: 'pending',
    priority: 'high',
    relatedTo: 'Empresa ABC Ltda.'
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Reunião com equipe de desenvolvimento',
    time: '14:30',
    status: 'pending',
    relatedTo: 'Interno'
  },
  {
    id: '3',
    type: 'deadline',
    title: 'Entrega da fase 1 do projeto XYZ',
    status: 'overdue',
    priority: 'high',
    relatedTo: 'Consultoria XYZ'
  },
  {
    id: '4',
    type: 'note',
    title: 'Verificar feedback do cliente sobre nova funcionalidade',
    relatedTo: 'Startup Tech'
  },
  {
    id: '5',
    type: 'task',
    title: 'Atualizar documentação do sistema',
    time: '16:00',
    status: 'pending',
    priority: 'medium',
    relatedTo: 'Interno'
  }
];
