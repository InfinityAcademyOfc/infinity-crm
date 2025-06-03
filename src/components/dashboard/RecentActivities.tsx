
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useActivities } from '@/hooks/useActivities';

export default function RecentActivities() {
  const { activities, loading } = useActivities();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Nenhuma atividade recente
          </p>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {activity.type.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.created_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
              <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {activity.priority === 'high' ? 'Alta' :
                 activity.priority === 'medium' ? 'Média' : 'Baixa'}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
