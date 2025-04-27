
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
