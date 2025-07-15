
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { clientService } from "@/services/api/clientService";
import { leadService } from "@/services/api/leadService";
import { ClientList } from "@/components/clients/ClientList";
import NewClientDialog from "@/components/clients/NewClientDialog";
import { ConvertLeadDialog } from "@/components/clients/ConvertLeadDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ClientManagement = () => {
  const { user, companyProfile } = useAuth();
  const queryClient = useQueryClient();
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [convertLeadOpen, setConvertLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const companyId = companyProfile?.company_id || user?.id || "";

  const { data: clients = [] } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: () => clientService.getClients(companyId),
    enabled: !!companyId,
    staleTime: 30000,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['leads', companyId],
    queryFn: () => leadService.getLeads(companyId),
    enabled: !!companyId,
    staleTime: 30000,
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = async (clientData: any) => {
    try {
      await clientService.createClient({
        ...clientData,
        company_id: companyId
      });
      queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
      toast.success("Cliente criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar cliente");
    }
  };

  const handleConvertLead = async (leadId: string, clientData: any) => {
    try {
      await clientService.createClient(clientData);
      await leadService.deleteLead(leadId);
      queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
      queryClient.invalidateQueries({ queryKey: ['leads', companyId] });
      toast.success("Lead convertido em cliente com sucesso!");
    } catch (error) {
      toast.error("Erro ao converter lead");
    }
  };

  const handleDeleteClient = async (client: any) => {
    try {
      await clientService.deleteClient(client.id);
      queryClient.invalidateQueries({ queryKey: ['clients', companyId] });
      toast.success("Cliente excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir cliente");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e converta leads
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const availableLeads = leads.filter(lead => !clients.some(client => client.email === lead.email));
              if (availableLeads.length > 0) {
                setSelectedLead(availableLeads[0]);
                setConvertLeadOpen(true);
              } else {
                toast.info("Nenhum lead disponível para conversão");
              }
            }}
          >
            Converter Lead
          </Button>
          <Button onClick={() => setNewClientOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <ClientList 
        clients={filteredClients}
        onDeleteClient={handleDeleteClient}
      />

      <NewClientDialog
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        onSave={handleCreateClient}
      />

      <ConvertLeadDialog
        open={convertLeadOpen}
        onOpenChange={setConvertLeadOpen}
        lead={selectedLead}
        onConvert={handleConvertLead}
      />
    </div>
  );
};

export default ClientManagement;
