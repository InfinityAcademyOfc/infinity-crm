
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRealSalesFunnel } from "@/hooks/useRealSalesFunnel";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RealSalesFunnelBoard } from "@/components/sales-funnel/RealSalesFunnelBoard";
import { FunnelAnalytics } from "@/components/sales-funnel/FunnelAnalytics";
import { NewSalesLeadDialog } from "@/components/sales-funnel/NewSalesLeadDialog";

const SalesFunnel = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { leads, stages, loading, error, getStageMetrics, refetch } = useRealSalesFunnel();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newLeadDialogOpen, setNewLeadDialogOpen] = useState(false);

  if (authLoading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!user || !company) {
    return <LoadingPage message="Acesso não autorizado" />;
  }

  if (loading) {
    return <LoadingPage message="Carregando funil de vendas..." />;
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SectionHeader 
          title="Funil de Vendas" 
          description="Gerencie seus leads e oportunidades de vendas"
        />
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stageMetrics = getStageMetrics();
  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader 
        title="Funil de Vendas" 
        description="Gerencie seus leads e oportunidades de vendas"
        actions={
          <>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                className="pl-10 focus-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="hover-scale transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showAnalytics ? 'Ocultar' : 'Mostrar'} Análises
            </Button>
            <Button 
              onClick={() => setNewLeadDialogOpen(true)}
              className="hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </>
        }
      />

      {/* Métricas Resumidas */}
      <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
        <Card className="hover-lift transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Badge variant="secondary">{stages.length} estágios</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Badge variant="default">Pipeline</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads Ativos</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => lead.stage !== 'Ganhos' && lead.stage !== 'Perdidos').length}
                </p>
              </div>
              <Badge variant="outline">Em progresso</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold">
                  {totalLeads > 0 ? Math.round((leads.filter(lead => lead.stage === 'Ganhos').length / totalLeads) * 100) : 0}%
                </p>
              </div>
              <Badge variant="success">Ganhos</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análises (opcional) */}
      {showAnalytics && (
        <FunnelAnalytics 
          funnelStageData={stageMetrics.map(stage => ({
            name: stage.name,
            value: stage.count
          }))}
          valuePotentialData={stageMetrics.map(stage => ({
            name: stage.name,
            value: stage.totalValue
          }))}
        />
      )}

      {/* Board do Kanban */}
      <RealSalesFunnelBoard 
        stages={stages}
        leads={filteredLeads}
        searchQuery={searchQuery}
      />

      {/* Dialog para Novo Lead */}
      <NewSalesLeadDialog
        open={newLeadDialogOpen}
        onOpenChange={setNewLeadDialogOpen}
        onSuccess={() => {
          refetch();
          setNewLeadDialogOpen(false);
        }}
      />
    </div>
  );
};

export default SalesFunnel;
