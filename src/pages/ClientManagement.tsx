
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Download, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClientList } from "@/components/clients/ClientList";
import { ClientAnalytics } from "@/components/clients/ClientAnalytics";
import { ClientCard } from "@/components/clients/ClientCard";
import ClientLtvFunnel from "@/components/clients/ClientLtvFunnel";
import NewClientDialog from "@/components/clients/NewClientDialog";
import { useToast } from "@/hooks/use-toast";
import { useRealClientData } from "@/hooks/useRealClientData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const ClientManagement = () => {
  const [viewType, setViewType] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { user, company } = useAuth();
  const { clients, analytics, loading, refetch } = useRealClientData();
  
  // Transform clients to match ClientList expected format
  const transformedClients = clients.map(client => ({
    ...client,
    nps: 0, // Default value, can be calculated from client_nps table
    ltv: 0  // Default value, can be calculated from client_ltv table
  }));
  
  const filteredClients = transformedClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (client.contact && client.contact.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: "Cliente removido",
        description: `${clientToDelete.name} foi removido com sucesso.`
      });
      
      refetch();
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente.",
        variant: "destructive"
      });
    }
    
    setDeleteDialogOpen(false);
  };
  
  const exportData = () => {
    if (filteredClients.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há clientes para exportar.",
        variant: "destructive"
      });
      return;
    }
    
    const header = ["Nome", "Contato", "Email", "Telefone", "Status", "Segmento", "Último Contato"];
    
    const csvData = [
      header.join(","),
      ...filteredClients.map(client => [
        `"${client.name}"`,
        `"${client.contact || ''}"`,
        client.email || '',
        client.phone || '',
        client.status,
        client.segment || '',
        client.last_contact || ''
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "A lista de clientes foi exportada com sucesso."
    });
  };

  if (!user || !company) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Faça login para gerenciar clientes</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-2">Carregando clientes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
            <TabsList className="grid grid-cols-3 h-8 w-[240px] px-[5px] my-0 py-0 mx-px">
              <TabsTrigger value="list" className="text-xs">Lista</TabsTrigger>
              <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
              <TabsTrigger value="ltv-kanban" className="text-xs">Kanban LTV</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button size="sm" className="h-8" onClick={() => setNewClientDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={exportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showAnalytics && <ClientAnalytics analytics={analytics} />}
      
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowAnalytics(s => !s)} 
          className="mx-auto mt-1"
        >
          <ChevronDown className={`transition-transform duration-200 ${showAnalytics ? "" : "rotate-180"}`} />
          <span className="sr-only">{showAnalytics ? "Esconder gráficos" : "Mostrar gráficos"}</span>
        </Button>
      </div>

      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum cliente encontrado.
            </p>
            <Button onClick={() => setNewClientDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
          <TabsContent value="list" className="p-0 m-0">
            <Card>
              <CardContent className="p-0">
                <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards" className="p-0 m-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onDeleteClient={handleDeleteClient} 
              />
            ))}
          </TabsContent>

          <TabsContent value="ltv-kanban" className="p-0 m-0">
            <ClientLtvFunnel />
          </TabsContent>
        </Tabs>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cliente {clientToDelete?.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <NewClientDialog 
        open={newClientDialogOpen} 
        onOpenChange={setNewClientDialogOpen}
        onClientCreated={refetch}
      />
    </div>
  );
};

export default ClientManagement;
