
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MoreHorizontal, Search, Plus, Download, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ClientList } from "@/components/clients/ClientList";
import { ClientAnalytics } from "@/components/clients/ClientAnalytics";
import { ClientCard } from "@/components/clients/ClientCard";
import ClientLtvFunnel from "@/components/clients/ClientLtvFunnel";
import NewClientDialog from "@/components/clients/NewClientDialog";
import { useToast } from "@/hooks/use-toast";

const npsData = [
  {
    name: 'Detratores',
    value: 15,
    color: '#EF4444'
  },
  {
    name: 'Neutros',
    value: 25,
    color: '#F59E0B'
  },
  {
    name: 'Promotores',
    value: 60,
    color: '#10B981'
  }
];

const ltvData = [
  {
    month: 'Jan',
    value: 2400
  },
  {
    month: 'Fev',
    value: 3200
  },
  {
    month: 'Mar',
    value: 4100
  },
  {
    month: 'Abr',
    value: 4800
  },
  {
    month: 'Mai',
    value: 5400
  },
  {
    month: 'Jun',
    value: 6200
  }
];

const initialClientsData = [
  {
    id: '1',
    name: 'Empresa XYZ Ltda',
    contact: 'João Silva',
    email: 'joao@xyz.com',
    phone: '(11) 9999-8888',
    status: 'active',
    nps: 9,
    ltv: 25000,
    lastContact: '2023-07-15',
    nextMeeting: '2023-07-30'
  },
  {
    id: '2',
    name: 'Tech Innovations Inc',
    contact: 'Maria Oliveira',
    email: 'maria@techinnovations.com',
    phone: '(11) 8888-7777',
    status: 'active',
    nps: 8,
    ltv: 42000,
    lastContact: '2023-07-10',
    nextMeeting: '2023-07-25'
  },
  {
    id: '3',
    name: 'Green Solutions',
    contact: 'Pedro Santos',
    email: 'pedro@greensolutions.com',
    phone: '(11) 7777-6666',
    status: 'inactive',
    nps: 6,
    ltv: 18000,
    lastContact: '2023-06-28',
    nextMeeting: null
  },
  {
    id: '4',
    name: 'Global Marketing Group',
    contact: 'Ana Ferreira',
    email: 'ana@globalmarketing.com',
    phone: '(11) 6666-5555',
    status: 'active',
    nps: 10,
    ltv: 65000,
    lastContact: '2023-07-18',
    nextMeeting: '2023-08-02'
  },
  {
    id: '5',
    name: 'Quantum Cybersecurity',
    contact: 'Rafael Lima',
    email: 'rafael@quantumcyber.com',
    phone: '(11) 5555-4444',
    status: 'at-risk',
    nps: 4,
    ltv: 30000,
    lastContact: '2023-07-05',
    nextMeeting: '2023-07-22'
  }
];

const ClientManagement = () => {
  const [viewType, setViewType] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [clientsData, setClientsData] = useState(initialClientsData);
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setClientsData(clientsData.filter(client => client.id !== clientToDelete.id));
    toast({
      title: "Cliente removido",
      description: `${clientToDelete.name} foi removido com sucesso.`
    });
    setDeleteDialogOpen(false);
  };
  
  const handleAddClient = (newClient) => {
    setClientsData([...clientsData, newClient]);
  };
  
  const exportData = () => {
    // Export based on current view
    if (viewType === "list" || viewType === "cards") {
      exportClients();
    } else if (viewType === "ltv-kanban") {
      exportAnalytics();
    }
  };
  
  const exportClients = () => {
    // Create CSV data
    const header = ["Nome", "Contato", "Email", "Telefone", "Status", "NPS", "LTV", "Último Contato", "Próxima Reunião"];
    
    const csvData = [
      header.join(","),
      ...filteredClients.map(client => [
        `"${client.name}"`,
        `"${client.contact}"`,
        client.email,
        client.phone,
        client.status,
        client.nps,
        client.ltv,
        client.lastContact,
        client.nextMeeting || ""
      ].join(","))
    ].join("\n");
    
    // Create and download file
    downloadCSV(csvData, "clientes.csv");
    
    toast({
      title: "Exportação concluída",
      description: "A lista de clientes foi exportada com sucesso."
    });
  };
  
  const exportAnalytics = () => {
    // Create CSV for analytics
    const npsCSV = [
      ["Categoria", "Valor"].join(","),
      ...npsData.map(item => [`"${item.name}"`, item.value].join(","))
    ].join("\n");
    
    const ltvCSV = [
      ["Mês", "Valor"].join(","),
      ...ltvData.map(item => [item.month, item.value].join(","))
    ].join("\n");
    
    // Download both files
    downloadCSV(npsCSV, "nps_data.csv");
    downloadCSV(ltvCSV, "ltv_data.csv");
    
    toast({
      title: "Exportação concluída",
      description: "Os dados de análise foram exportados com sucesso."
    });
  };
  
  const downloadCSV = (data, filename) => {
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      
      {showAnalytics && <ClientAnalytics npsData={npsData} ltvData={ltvData} />}
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
      
      {/* Delete Confirmation Dialog */}
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
      
      {/* Add New Client Dialog */}
      <NewClientDialog 
        open={newClientDialogOpen} 
        onOpenChange={setNewClientDialogOpen}
        onAddClient={handleAddClient}
      />
    </div>
  );
};

export default ClientManagement;
