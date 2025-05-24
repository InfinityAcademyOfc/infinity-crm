
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useActivities } from '@/hooks/useActivities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RealActivitiesSection = () => {
  const { activities, loading, createActivity } = useActivities();

  const handleCreateSampleActivity = async () => {
    await createActivity({
      type: 'lead_contact',
      title: 'Contato com novo lead',
      description: 'Entrar em contato com lead interessado em nossos serviços',
      related_to: 'lead',
      related_id: null,
      priority: 'medium',
      status: 'pending',
      created_by: null
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Atividades Recentes</CardTitle>
          <Button 
            size="sm" 
            onClick={handleCreateSampleActivity}
            className="hover-scale transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Atividade
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">Nenhuma atividade encontrada</p>
            <Button 
              onClick={handleCreateSampleActivity}
              className="hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Atividade
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(activity.status)}
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description || 'Sem descrição'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealActivitiesSection;
