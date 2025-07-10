
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Phone, Mail, Calendar, MoreHorizontal, FileEdit, Trash2 } from "lucide-react";
import { Client } from "@/types/client";

interface ClientCardProps {
  client: Client & { nps?: number; ltv?: number };
  onDeleteClient: (client: Client) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onDeleteClient }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="text-lg font-semibold">{client.name}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
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
        </div>
        <Badge variant={
          client.status === 'active' ? 'outline' :
          client.status === 'inactive' ? 'secondary' : 'destructive'
        } className="w-fit">
          {client.status === 'active' ? 'Ativo' :
           client.status === 'inactive' ? 'Inativo' : 'Em Risco'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <div className="font-medium">{client.contact}</div>
          <div className="text-muted-foreground">{client.email}</div>
          <div className="text-muted-foreground">{client.phone}</div>
        </div>
        {client.nps !== undefined && (
          <div>
            <div className="text-sm font-medium mb-1 flex justify-between">
              <span>Satisfação (NPS)</span>
              <span>{client.nps}/10</span>
            </div>
            <Progress value={client.nps * 10} className="h-1.5" />
          </div>
        )}
        {client.ltv !== undefined && (
          <div>
            <div className="text-sm font-medium mb-1">Valor do Cliente (LTV)</div>
            <div className="font-semibold">R$ {client.ltv.toLocaleString()}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-3">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Phone className="h-3 w-3 mr-2" />
            Ligar
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Mail className="h-3 w-3 mr-2" />
            Email
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
