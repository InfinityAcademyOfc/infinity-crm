
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  MoreHorizontal,
  Video,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMeetings } from '@/hooks/useMeetings';

const Meetings = () => {
  const { meetings, loading } = useMeetings();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Agendada</Badge>;
      case 'in_progress':
        return <Badge variant="default">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="secondary">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reuniões</h1>
          <p className="text-muted-foreground">
            Gerencie suas reuniões e compromissos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reunião
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agenda de Reuniões ({meetings.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Nenhuma reunião agendada
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Primeira Reunião
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        {getStatusBadge(meeting.status)}
                      </div>
                      
                      {meeting.description && (
                        <p className="text-muted-foreground mb-3">
                          {meeting.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(meeting.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{meeting.participants} participantes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {meeting.status === 'scheduled' && (
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-2" />
                          Iniciar
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Meetings;
