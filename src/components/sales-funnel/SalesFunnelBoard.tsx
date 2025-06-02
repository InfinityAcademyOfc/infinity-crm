
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, TrendingUp, MoreHorizontal, Phone, Mail } from 'lucide-react';
import { useRealSalesFunnel } from '@/hooks/useRealSalesFunnel';
import { NewSalesLeadDialog } from './NewSalesLeadDialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface SalesFunnelBoardProps {
  className?: string;
}

const SalesFunnelBoard: React.FC<SalesFunnelBoardProps> = ({ className }) => {
  const { stages, leads, loading, moveLeadToStage, deleteLead } = useRealSalesFunnel();
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false);

  const getLeadsByStage = (stageName: string) => {
    return leads.filter(lead => lead.stage === stageName || lead.stage.toLowerCase() === stageName.toLowerCase());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const totalLeads = leads.length;
  const wonLeads = leads.filter(lead => lead.stage.toLowerCase().includes('ganho') || lead.stage.toLowerCase().includes('won')).length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg">Carregando funil de vendas...</div>
      </div>
    );
  }

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
              <Button size="sm" onClick={() => setShowNewLeadDialog(true)}>
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
              <div className="text-2xl font-bold text-blue-600">{conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.name);
            const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

            return (
              <div key={stage.id} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-lg border shadow-sm">
                  <div 
                    className="p-4 rounded-t-lg text-white font-medium"
                    style={{ backgroundColor: stage.color }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{stage.name}</span>
                      <span className="text-sm opacity-90">
                        {stageLeads.length}
                      </span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      R$ {stageValue.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-gray-50 p-3 rounded-lg border hover:shadow-md transition-shadow cursor-move"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{lead.name}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" />
                                Ligar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteLead(lead.id)}
                                className="text-red-600"
                              >
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {lead.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {lead.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                            {lead.priority === 'high' ? 'Alta' : 
                             lead.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          <span className="text-sm font-medium text-green-600">
                            R$ {(lead.value || 0).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        
                        {(lead.email || lead.phone) && (
                          <div className="mt-2 space-y-1">
                            {lead.email && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {lead.email}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {stageLeads.length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-8">
                        Nenhum lead neste estágio
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewSalesLeadDialog
        open={showNewLeadDialog}
        onOpenChange={setShowNewLeadDialog}
        onSuccess={() => setShowNewLeadDialog(false)}
      />
    </div>
  );
};

export default SalesFunnelBoard;
