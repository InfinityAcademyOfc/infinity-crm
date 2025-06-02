
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { KanbanColumnItem, KanbanCardItem } from '@/components/kanban/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Filter, TrendingUp } from 'lucide-react';

interface SalesFunnelBoardProps {
  className?: string;
}

const initialColumns: KanbanColumnItem[] = [
  {
    id: 'prospects',
    title: 'Prospects',
    color: '#ef4444',
    cards: [
      {
        id: 'prospect-1',
        title: 'João Silva',
        description: 'Interessado em consultoria empresarial',
        priority: 'high',
        value: 15000,
        dueDate: '2024-12-30',
        tags: [
          { label: 'Quente', color: '#ef4444' },
          { label: 'Consultoria', color: '#3b82f6' }
        ],
        assignedTo: {
          id: '1',
          name: 'Carlos Santos',
          avatar: '/placeholder.svg'
        }
      }
    ]
  },
  {
    id: 'qualified',
    title: 'Qualificados',
    color: '#f59e0b',
    cards: [
      {
        id: 'qualified-1',
        title: 'Maria Oliveira',
        description: 'Orçamento aprovado, aguardando contrato',
        priority: 'medium',
        value: 25000,
        dueDate: '2024-12-25',
        tags: [
          { label: 'Aprovado', color: '#10b981' },
          { label: 'Contrato', color: '#8b5cf6' }
        ]
      }
    ]
  },
  {
    id: 'proposal',
    title: 'Proposta',
    color: '#3b82f6',
    cards: []
  },
  {
    id: 'negotiation',
    title: 'Negociação',
    color: '#8b5cf6',
    cards: []
  },
  {
    id: 'closed-won',
    title: 'Fechado - Ganho',
    color: '#10b981',
    cards: []
  },
  {
    id: 'closed-lost',
    title: 'Fechado - Perdido',
    color: '#6b7280',
    cards: []
  }
];

const SalesFunnelBoard: React.FC<SalesFunnelBoardProps> = ({ className }) => {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(initialColumns);

  const handleAddCard = (columnId: string) => {
    const newCard: KanbanCardItem = {
      id: `card-${Date.now()}`,
      title: 'Novo Lead',
      description: 'Descrição do lead',
      priority: 'medium',
      value: 0,
      tags: []
    };

    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    ));
  };

  const totalValue = columns.reduce((sum, col) => 
    sum + col.cards.reduce((cardSum, card) => cardSum + (card.value || 0), 0), 0
  );

  const totalLeads = columns.reduce((sum, col) => sum + col.cards.length, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Funil de Vendas
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button size="sm" onClick={() => handleAddCard('prospects')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total de Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                R$ {totalValue.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalLeads > 0 ? Math.round((columns.find(c => c.id === 'closed-won')?.cards.length || 0) / totalLeads * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="min-h-[600px]">
        <KanbanBoard 
          columns={columns}
          setColumns={setColumns}
          onAddCard={handleAddCard}
        />
      </div>
    </div>
  );
};

export default SalesFunnelBoard;
