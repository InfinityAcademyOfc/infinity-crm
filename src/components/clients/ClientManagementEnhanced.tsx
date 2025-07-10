import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Download, Users, TrendingUp } from "lucide-react";
import { ClientList } from "@/components/clients/ClientList";
import { ClientAnalytics } from "@/components/clients/ClientAnalytics";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientMetricsCards } from "@/components/clients/ClientMetricsCards";
import { ConvertLeadDialog } from "@/components/clients/ConvertLeadDialog";
import NewClientDialog from "@/components/clients/NewClientDialog";
import { clientService } from "@/services/api/clientService";
import { funnelService } from "@/services/api/funnelService";
import { useClientAnalytics } from "@/hooks/useClientAnalytics";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/client";

// Extended client interface for UI components
interface ClientWithAnalytics extends Client {
  nps: number;
  ltv: number;
}

export const ClientManagementEnhanced = () => {
  const { user, companyProfile } = useAuth();
  const companyId = companyProfile?.company_id || user?.id || "";
  
  const [viewType, setViewType] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
  const [convertLeadDialogOpen, setConvertLeadDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const {
    clientLTV,
    clientNPS,
    clientSatisfaction,
    metrics,
    convertLeadToClient,
    addNPS,
    addSatisfaction
  } = useClientAnalytics(companyId);

  useEffect(() => {
    if (companyId) {
      loadData();
    }
  }, [companyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, leadsData] = await Promise.all([
        clientService.getClients(companyId),
        funnelService.getSalesLeads(companyId)
      ]);
      
      setClients(clientsData);
      setLeads(leadsData.filter(lead => lead.stage !== 'Ganhos')); // Only non-converted leads
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (newClient: any) => {
    const created = await clientService.createClient({
      ...newClient,
      company_id: companyId
    });
    
    if (created) {
      setClients(current => [created, ...current]);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    const success = await clientService.deleteClient(client.id);
    if (success) {
      setClients(current => current.filter(c => c.id !== client.id));
    }
  };

  const handleConvertLead = async (leadId: string, clientData: any) => {
    const newClient = await convertLeadToClient(leadId, clientData);
    if (newClient) {
      setClients(current => [newClient, ...current]);
      setLeads(current => current.filter(l => l.id !== leadId));
      setConvertLeadDialogOpen(false);
      setSelectedLead(null);
    }
  };

  // Transform clients with analytics data for UI components
  const getClientsWithAnalytics = (): ClientWithAnalytics[] => {
    return clients.map(client => {
      const clientLTVData = clientLTV.find(ltv => ltv.client_id === client.id);
      const clientNPSData = clientNPS.filter(nps => nps.client_id === client.id);
      const avgNPS = clientNPSData.length > 0 
        ? clientNPSData.reduce((sum, nps) => sum + nps.score, 0) / clientNPSData.length 
        : 0;

      return {
        ...client,
        nps: Math.round(avgNPS),
        ltv: clientLTVData?.calculated_ltv || 0
      };
    });
  };

  const filteredClients = getClientsWithAnalytics().filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.contact?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.segment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportData = () => {
    const header = ["Nome", "Contato", "Email", "Telefone", "Segmento", "Status", "Cidade", "Estado"];
    
    const csvData = [
      header.join(","),
      ...filteredClients.map(client => [
        `"${client.name}"`,
        `"${client.contact || ""}"`,
        client.email || "",
        client.phone || "",
        client.segment || "",
        client.status,
        client.city || "",
        client.state || ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "clientes.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "A lista de clientes foi exportada com sucesso."
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Gerencie seus clientes e analise métricas importantes</p>
        </div>
        
        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedLead(leads[0]);
                setConvertLeadDialogOpen(true);
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Converter Lead
            </Button>
          )}
          
          <Button size="sm" onClick={() => setNewClientDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <ClientMetricsCards metrics={metrics} totalClients={clients.length} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-[400px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            className="pl-8" 
          />
        </div>
        
        <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
          <TabsList className="grid grid-cols-3 h-8 w-[240px]">
            <TabsTrigger value="list" className="text-xs">Lista</TabsTrigger>
            <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={viewType} onValueChange={setViewType} className="w-full">
        <TabsContent value="list" className="p-0 m-0">
          <Card>
            <CardContent className="p-0">
              <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards" className="p-0 m-0">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  {searchQuery ? "Tente ajustar sua busca ou" : "Comece"} adicionando seu primeiro cliente.
                </p>
                <Button className="mt-4" onClick={() => setNewClientDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredClients.map(client => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onDeleteClient={handleDeleteClient} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="p-0 m-0">
          <ClientAnalytics 
            npsData={[
              { name: 'Promotores', value: metrics.npsDistribution.promoters, color: '#10B981' },
              { name: 'Neutros', value: metrics.npsDistribution.passives, color: '#F59E0B' },
              { name: 'Detratores', value: metrics.npsDistribution.detractors, color: '#EF4444' }
            ]}
            ltvData={clientLTV.map(ltv => ({
              month: new Date(ltv.updated_at).toLocaleDateString('pt-BR', { month: 'short' }),
              value: ltv.calculated_ltv
            }))}
          />
        </TabsContent>
      </Tabs>

      <NewClientDialog 
        open={newClientDialogOpen} 
        onOpenChange={setNewClientDialogOpen}
        onAddClient={handleAddClient}
      />

      <ConvertLeadDialog
        open={convertLeadDialogOpen}
        onOpenChange={setConvertLeadDialogOpen}
        lead={selectedLead}
        onConvert={handleConvertLead}
      />
    </div>
  );
};
