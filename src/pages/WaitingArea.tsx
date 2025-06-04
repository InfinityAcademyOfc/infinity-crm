
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const WaitingArea = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Conta em Análise</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Sua conta está sendo analisada pela nossa equipe. 
            Você receberá um email quando a aprovação for concluída.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Tempo estimado: 24-48 horas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingArea;
