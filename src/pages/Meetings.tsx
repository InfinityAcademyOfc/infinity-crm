
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const Meetings = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reuniões</h1>
        <p className="text-muted-foreground">
          Gerencie suas reuniões e compromissos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Nenhuma reunião agendada
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Agende suas primeiras reuniões
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Meetings;
