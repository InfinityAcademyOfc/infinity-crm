
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealClientData } from '@/hooks/useRealClientData';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ClientList } from '@/components/clients/ClientList';
import { ClientAnalytics } from '@/components/clients/ClientAnalytics';
import { NewClientDialog } from '@/components/clients/NewClientDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClientManagement = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { clients, loading, refetch } = useRealClientData();
  const [searchQuery, setSearchQuery] = useState('');
  const [newClientDialogOpen, setNewClientDialogOpen] = useState(false);

  if (authLoading) {
    return <LoadingPage message="Verificando autenticação..." />;
  }

  if (!user || !company) {
    return <LoadingPage message="Acesso não autorizado" />;
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader 
        title="Gestão de Clientes" 
        description="Gerencie sua base de clientes e acompanhe relacionamentos"
        actions={
          <>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-10 focus-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="hover-scale transition-all duration-200">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            <Button 
              onClick={() => setNewClientDialogOpen(true)}
              className="hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <Card className="animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece adicionando seu primeiro cliente ao sistema'
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setNewClientDialogOpen(true)}
                className="hover-scale transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="list" className="animate-fade-in">
          <TabsList>
            <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="animate-fade-in">
            <ClientList clients={filteredClients} />
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in">
            <ClientAnalytics clients={clients} />
          </TabsContent>
        </Tabs>
      )}

      <NewClientDialog
        open={newClientDialogOpen}
        onOpenChange={setNewClientDialogOpen}
        onClientCreated={refetch}
      />
    </div>
  );
};

export default ClientManagement;
