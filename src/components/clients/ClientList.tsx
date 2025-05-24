
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileEdit, Trash2, Star, StarHalf, Phone, Mail, Calendar, MoreHorizontal } from "lucide-react";

interface Client {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  segment: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
  company_id: string;
}

interface ClientListProps {
  clients: Client[];
}

export const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const handleDeleteClient = (client: Client) => {
    // TODO: Implement delete functionality
    console.log('Delete client:', client.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Em Risco';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Segmento</TableHead>
            <TableHead>Último Contato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            clients.map(client => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  {client.email && (
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {client.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    {client.contact && (
                      <div className="font-medium text-sm">{client.contact}</div>
                    )}
                    {client.phone && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(client.status)}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.segment ? (
                    <Badge variant="outline">{client.segment}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.last_contact ? (
                    <div className="text-sm">
                      {new Date(client.last_contact).toLocaleDateString('pt-BR')}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <FileEdit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Reunião
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClient(client)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
