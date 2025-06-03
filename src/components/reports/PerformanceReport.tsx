
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { User, Target, Clock, Star } from 'lucide-react';

const PerformanceReport = () => {
  const teamPerformance = [
    { name: 'João Silva', vendas: 28, meta: 25, conversao: 85, satisfacao: 4.8 },
    { name: 'Maria Santos', vendas: 32, meta: 30, conversao: 78, satisfacao: 4.6 },
    { name: 'Pedro Costa', vendas: 24, meta: 25, conversao: 92, satisfacao: 4.9 },
    { name: 'Ana Oliveira', vendas: 35, meta: 30, conversao: 88, satisfacao: 4.7 }
  ];

  const departmentData = [
    { department: 'Vendas', performance: 92, efficiency: 88, satisfaction: 85 },
    { department: 'Marketing', performance: 78, efficiency: 82, satisfaction: 90 },
    { department: 'Suporte', performance: 95, efficiency: 87, satisfaction: 92 },
    { department: 'Financeiro', performance: 85, efficiency: 90, satisfaction: 78 }
  ];

  const goalProgress = [
    { goal: 'Receita Mensal', current: 127000, target: 150000, progress: 84.7 },
    { goal: 'Novos Clientes', current: 42, target: 50, progress: 84 },
    { goal: 'Taxa de Conversão', current: 23.4, target: 25, progress: 93.6 },
    { goal: 'Satisfação Cliente', current: 4.7, target: 4.8, progress: 97.9 }
  ];

  return (
    <div className="space-y-6">
      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Performance da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-2">
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Vendas</p>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{member.vendas}</span>
                    <span className="text-sm text-muted-foreground">/ {member.meta}</span>
                  </div>
                  <Badge variant={member.vendas >= member.meta ? "default" : "secondary"}>
                    {((member.vendas / member.meta) * 100).toFixed(0)}%
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Conversão</p>
                  <p className="font-semibold">{member.conversao}%</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{member.satisfacao}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise por Departamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={departmentData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="department" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Performance" dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Eficiência" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso das Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goalProgress.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.goal}</span>
                    <Badge variant={goal.progress >= 90 ? "default" : goal.progress >= 70 ? "secondary" : "destructive"}>
                      {goal.progress.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Atual: {goal.current.toLocaleString()}</span>
                    <span>Meta: {goal.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtividade Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">↑ 5% vs. mês anterior</p>
            <Progress value={87} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3h</div>
            <p className="text-xs text-muted-foreground">↓ 12% vs. mês anterior</p>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Cliente</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">↑ 0.2 vs. mês anterior</p>
            <Progress value={94} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { day: 'Seg', tasks: 45, calls: 28, emails: 67 },
              { day: 'Ter', tasks: 52, calls: 35, emails: 73 },
              { day: 'Qua', tasks: 48, calls: 31, emails: 65 },
              { day: 'Qui', tasks: 56, calls: 42, emails: 78 },
              { day: 'Sex', tasks: 43, calls: 28, emails: 61 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" name="Tarefas" />
              <Bar dataKey="calls" fill="#10b981" name="Ligações" />
              <Bar dataKey="emails" fill="#f59e0b" name="Emails" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceReport;
