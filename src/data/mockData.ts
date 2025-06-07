
export const mockTransactions = [
  {
    id: '1',
    type: 'income',
    description: 'Pagamento de cliente ABC',
    amount: 5000,
    date: '2023-05-01',
    category: 'Vendas',
    client: 'Empresa ABC Ltda.',
    status: 'completed',
    notes: 'Pagamento referente ao projeto de desenvolvimento'
  },
  {
    id: '2',
    type: 'expense',
    description: 'Aluguel do escritório',
    amount: 2500,
    date: '2023-05-02',
    category: 'Infraestrutura',
    client: null,
    status: 'completed',
    notes: 'Pagamento mensal'
  },
  {
    id: '3',
    type: 'income',
    description: 'Consultoria para XYZ Corp',
    amount: 3000,
    date: '2023-05-10',
    category: 'Consultoria',
    client: 'XYZ Corporation',
    status: 'completed',
    notes: ''
  },
  {
    id: '4',
    type: 'expense',
    description: 'Assinatura Software',
    amount: 500,
    date: '2023-05-15',
    category: 'Software',
    client: null,
    status: 'completed',
    notes: 'Assinatura anual'
  },
  {
    id: '5',
    type: 'income',
    description: 'Treinamento para equipe',
    amount: 1500,
    date: '2023-05-20',
    category: 'Serviços',
    client: 'Startup Alpha',
    status: 'completed',
    notes: 'Workshop de 2 dias'
  },
  {
    id: '6',
    type: 'expense',
    description: 'Marketing Digital',
    amount: 1000,
    date: '2023-05-22',
    category: 'Marketing',
    client: null,
    status: 'completed',
    notes: 'Campanha de redes sociais'
  }
];

// Adding mock sales data
export const mockSalesData = [
  { month: 'Jan', value: 45000 },
  { month: 'Fev', value: 52000 },
  { month: 'Mar', value: 48000 },
  { month: 'Abr', value: 61000 },
  { month: 'Mai', value: 55000 },
  { month: 'Jun', value: 67000 },
  { month: 'Jul', value: 72000 },
  { month: 'Ago', value: 69000 },
  { month: 'Set', value: 78000 },
  { month: 'Out', value: 83000 },
  { month: 'Nov', value: 79000 },
  { month: 'Dez', value: 95000 }
];

// Adding mock funnel data
export const mockFunnelData = {
  stages: [
    { name: 'Prospecção', value: 120 },
    { name: 'Qualificação', value: 75 },
    { name: 'Proposta', value: 40 },
    { name: 'Negociação', value: 28 },
    { name: 'Fechamento', value: 18 }
  ],
  conversionRate: 15
};

// Adding mock today activities
export const mockTodayActivities = [
  {
    id: '1',
    type: 'task',
    title: 'Enviar proposta comercial',
    time: '14:30',
    relatedTo: 'Cliente XYZ',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Reunião com equipe de vendas',
    time: '15:00',
    relatedTo: 'Interno',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'deadline',
    title: 'Prazo final: Relatório mensal',
    time: '18:00',
    relatedTo: 'Gestão',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '4',
    type: 'note',
    title: 'Feedback sobre nova funcionalidade',
    time: '10:15',
    relatedTo: 'Produto',
    status: 'completed',
    priority: 'low'
  },
  {
    id: '5',
    type: 'task',
    title: 'Atualizar pipeline de vendas',
    time: '11:30',
    relatedTo: 'CRM',
    status: 'overdue',
    priority: 'medium'
  }
];

// Adding mock products
export const mockProducts = [
  {
    id: '1',
    name: 'Sistema ERP Completo',
    category: 'Software',
    price: 12000,
    recurrence: 'yearly',
    stock: null,
    description: 'Sistema completo de gestão empresarial com módulos de vendas, financeiro, estoque e RH.'
  },
  {
    id: '2',
    name: 'Consultoria Estratégica',
    category: 'Serviço',
    price: 5000,
    recurrence: 'one-time',
    stock: null,
    description: 'Análise completa do negócio com recomendações estratégicas para crescimento.'
  },
  {
    id: '3',
    name: 'Marketing Digital',
    category: 'Serviço',
    price: 2500,
    recurrence: 'monthly',
    stock: null,
    description: 'Gestão completa de campanhas de marketing digital e redes sociais.'
  },
  {
    id: '4',
    name: 'Notebook Dell XPS',
    category: 'Produto',
    price: 8500,
    recurrence: 'one-time',
    stock: 5,
    description: 'Notebook premium com processador i7, 16GB RAM e 512GB SSD.'
  },
  {
    id: '5',
    name: 'Licença Microsoft Office',
    category: 'Software',
    price: 800,
    recurrence: 'yearly',
    stock: null,
    description: 'Pacote completo Microsoft Office com Word, Excel, PowerPoint e Outlook.'
  },
  {
    id: '6',
    name: 'Suporte Técnico',
    category: 'Serviço',
    price: 1200,
    recurrence: 'monthly',
    stock: null,
    description: 'Suporte técnico remoto 24/7 para todos os sistemas e equipamentos.'
  }
];

// Adding mock team members
export const mockTeamMembers = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@empresa.com',
    role: 'CEO',
    department: 'Executive',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2020-01-15',
    phone: '(11) 99999-1111',
    tasksAssigned: 12,
    tasksCompleted: 10
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@empresa.com',
    role: 'Sales Director',
    department: 'Sales',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2020-03-10',
    phone: '(11) 99999-2222',
    tasksAssigned: 15,
    tasksCompleted: 13
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro.santos@empresa.com',
    role: 'Marketing Director',
    department: 'Marketing',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2020-05-22',
    phone: '(11) 99999-3333',
    tasksAssigned: 18,
    tasksCompleted: 15
  },
  {
    id: '4',
    name: 'Juliana Lima',
    email: 'juliana.lima@empresa.com',
    role: 'Sales Representative Corporate',
    department: 'Sales',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2021-01-05',
    phone: '(11) 99999-4444',
    tasksAssigned: 20,
    tasksCompleted: 18
  },
  {
    id: '5',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@empresa.com',
    role: 'Sales Representative Retail',
    department: 'Sales',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2021-04-12',
    phone: '(11) 99999-5555',
    tasksAssigned: 16,
    tasksCompleted: 14
  },
  {
    id: '6',
    name: 'Camila Ferreira',
    email: 'camila.ferreira@empresa.com',
    role: 'Digital Marketing Specialist',
    department: 'Marketing',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2021-06-30',
    phone: '(11) 99999-6666',
    tasksAssigned: 14,
    tasksCompleted: 12
  },
  {
    id: '7',
    name: 'Lucas Costa',
    email: 'lucas.costa@empresa.com',
    role: 'Senior Developer',
    department: 'Tech',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2021-08-15',
    phone: '(11) 99999-7777',
    tasksAssigned: 22,
    tasksCompleted: 20
  },
  {
    id: '8',
    name: 'Fernanda Sousa',
    email: 'fernanda.sousa@empresa.com',
    role: 'UX Designer',
    department: 'Tech',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2022-01-10',
    phone: '(11) 99999-8888',
    tasksAssigned: 10,
    tasksCompleted: 8
  },
  {
    id: '9',
    name: 'Gustavo Mendes',
    email: 'gustavo.mendes@empresa.com',
    role: 'Infrastructure Specialist',
    department: 'IT',
    avatar: '/placeholder.svg',
    status: 'active',
    joinedDate: '2022-03-01',
    phone: '(11) 99999-9999',
    tasksAssigned: 12,
    tasksCompleted: 10
  }
];
