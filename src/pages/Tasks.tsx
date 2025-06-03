
import React from 'react';
import { SectionHeader } from '@/components/ui/section-header';

const Tasks = () => {
  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Tarefas" 
        description="Gerencie suas tarefas e atividades"
      />
      <div className="text-center py-8 text-muted-foreground">
        <p>Sistema de tarefas em desenvolvimento...</p>
      </div>
    </div>
  );
};

export default Tasks;
