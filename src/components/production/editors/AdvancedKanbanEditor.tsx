
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Plus,
  Filter,
  Search,
  Settings,
  Users,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import KanbanBoard from '../../kanban/KanbanBoard';
import type { KanbanColumnItem } from '../../kanban/types';

interface AdvancedKanbanEditorProps {
  data: any;
  onChange: (data: any) => void;
  projectId: string;
}

export default function AdvancedKanbanEditor({ 
  data, 
  onChange, 
  projectId 
}: AdvancedKanbanEditorProps) {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(data.columns || [
    { 
      id: 'todo', 
      title: 'Para Fazer', 
      tasks: [],
      color: '#ef4444'
    },
    { 
      id: 'doing', 
      title: 'Fazendo', 
      tasks: [],
      color: '#f59e0b'
    },
    { 
      id: 'done', 
      title: 'Concluído', 
      tasks: [],
      color: '#10b981'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    onChange({ 
      ...data, 
      columns,
      version: (data.version || 1) + 1 
    });
  }, [columns]);

  const handleAddColumn = () => {
    const newColumn: KanbanColumnItem = {
      id: `column-${Date.now()}`,
      title: `Nova Coluna ${columns.length + 1}`,
      tasks: [],
      color: '#6366f1'
    };
    setColumns([...columns, newColumn]);
  };

  const handleAddTask = (columnId: string) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: 'Nova Tarefa',
      description: 'Descrição da tarefa',
      priority: 'medium' as const,
      assignee: '',
      dueDate: '',
      tags: []
    };

    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);
  const completedTasks = columns.find(col => col.id === 'done')?.tasks.length || 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Quadro Kanban</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" />
              Membros
            </Button>
            <Button size="sm" onClick={handleAddColumn}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Coluna
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Total: {totalTasks} tarefas</span>
            <span>Concluídas: {completedTasks}</span>
            <span>Progresso: {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-4">
        <div className="h-full">
          <KanbanBoard 
            columns={columns}
            setColumns={setColumns}
          />
        </div>
      </div>

      {/* Quick add buttons for each column */}
      <div className="border-t p-4">
        <div className="flex gap-2 flex-wrap">
          {columns.map((column) => (
            <Button
              key={column.id}
              variant="outline"
              size="sm"
              onClick={() => handleAddTask(column.id)}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Adicionar em {column.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
