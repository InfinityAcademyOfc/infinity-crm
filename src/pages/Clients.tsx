
import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, MapPin } from 'lucide-react';
import { useRealClientData } from '@/hooks/useRealClientData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Clients = () => {
  const { clients, loading, createClient } = useRealClientData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    segment: '',
    status: 'active',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient(newClient);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        segment: '',
        status: 'active',
        street: '',
        city: '',
        state: '',
        zip: ''
      });
      setShowNewClientDialog(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader title="Clientes" description="Gerencie sua base de clientes" />
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Clientes" description="Gerencie sua base de clientes">
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="segment">Segmento</Label>
                  <Input
                    id="segment"
                    value={newClient.segment}
                    onChange={(e) => setNewClient({ ...newClient, segment: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newClient.status} onValueChange={(value) => setNewClient({ ...newClient, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Endereço</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input
                      id="street"
                      value={newClient.street}
                      onChange={(e) => setNewClient({ ...newClient, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={newClient.state}
                      onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewClientDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Cliente</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </SectionHeader>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status === 'active' ? 'Ativo' : 
                   client.status === 'inactive' ? 'Inativo' : 'Prospect'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {client.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {client.phone}
                </div>
              )}
              {(client.city || client.state) && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {[client.city, client.state].filter(Boolean).join(', ')}
                </div>
              )}
              {client.segment && (
                <Badge variant="outline" className="text-xs">
                  {client.segment}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Clients;
