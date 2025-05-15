
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
  contact: string;
  email: string;
  phone: string;
  status: string;
  nps: number;
  ltv: number;
}

interface ClientListProps {
  clients: Client[];
  onDeleteClient: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ clients, onDeleteClient }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>NPS</TableHead>
          <TableHead>LTV</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map(client => (
          <TableRow key={client.id}>
            <TableCell>
              <div className="font-medium">{client.name}</div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{client.contact}</div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {client.email}
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {client.phone}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={
                client.status === 'active' ? 'outline' :
                client.status === 'inactive' ? 'secondary' : 'destructive'
              }>
                {client.status === 'active' ? 'Ativo' :
                 client.status === 'inactive' ? 'Inativo' : 'Em Risco'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {client.nps >= 9 ? (
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                ) : client.nps >= 7 ? (
                  <StarHalf className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                  <Star className="h-4 w-4 text-gray-300 mr-1" />
                )}
                <span>{client.nps}/10</span>
              </div>
            </TableCell>
            <TableCell>
              <div>R$ {client.ltv.toLocaleString()}</div>
              <Progress value={client.ltv > 50000 ? 100 : (client.ltv / 500)} className="h-1" />
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
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Reunião
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDeleteClient(client)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
