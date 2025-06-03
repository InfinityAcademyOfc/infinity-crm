
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User,
  Flag,
  Trash2,
  Edit
} from 'lucide-react';
import { ProductionProject } from '@/hooks/useProductionWorkspace';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

interface KanbanEditorProps {
  project: ProductionProject;
  onUpdate: (id: string, updates: Partial<ProductionProject>) => Promise<ProductionProject | null>;
}

const KanbanEditor: React.FC<KanbanEditorProps> = ({ project, onUpdate }) => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);

  useEffect(() => {
    if (project.data?.columns) {
      setColumns(project.data.columns);
    } else {
      // Criar colunas padrão
      const defaultColumns: KanbanColumn[] = [
        {
          id: 'todo',
          title: 'A Fazer',
          color: '#6b7280',
          cards: []
        },
        {
          id: 'doing',
          title: 'Em Andamento',
          color: '#3b82f6',
          cards: []
        },
        {
          id: 'done',
          title: 'Concluído',
          color: '#10b981',
          cards: []
        }
      ];
      setColumns(defaultColumns);
    }
  }, [project]);

  const saveColumns = async (newColumns: KanbanColumn[]) => {
    await onUpdate(project.id, {
      data: {
        ...project.data,
        columns: newColumns
      }
    });
  };

  const addColumn = () => {
    const newColumn: KanbanColumn = {
      id: Date.now().toString(),
      title: 'Nova Coluna',
      color: '#8b5cf6',
      cards: []
    };
    
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    saveColumns(updatedColumns);
  };

  const addCard = (columnId: string, card: Omit<KanbanCard, 'id'>) => {
    const newCard: KanbanCard = {
      ...card,
      id: Date.now().toString()
    };

    const updatedColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    );

    setColumns(updatedColumns);
    saveColumns(updatedColumns);
  };

  const updateCard = (columnId: string, cardId: string, updates: Partial<KanbanCard>) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map(card =>
              card.id === cardId ? { ...card, ...updates } : card
            )
          }
        : col
    );

    setColumns(updatedColumns);
    saveColumns(updatedColumns);
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
        : col
    );

    setColumns(updatedColumns);
    saveColumns(updatedColumns);
  };

  const moveCard = (fromColumnId: string, toColumnId: string, cardId: string) => {
    const fromColumn = columns.find(col => col.id === fromColumnId);
    const card = fromColumn?.cards.find(c => c.id === cardId);
    
    if (!card) return;

    const updatedColumns = columns.map(col => {
      if (col.id === fromColumnId) {
        return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
      } else if (col.id === toColumnId) {
        return { ...col, cards: [...col.cards, card] };
      }
      return col;
    });

    setColumns(updatedColumns);
    saveColumns(updatedColumns);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
        <Button onClick={addColumn} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Coluna
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {columns.reduce((acc, col) => acc + col.cards.length, 0)} cards
          </Badge>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <Card>
              <CardHeader
                className="text-white"
                style={{ backgroundColor: column.color }}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{column.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {column.cards.length}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedColumn(column.id);
                        setShowNewCardDialog(true);
                      }}
                      className="text-white hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {column.cards.map((card) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{card.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingCard(card)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteCard(column.id, card.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {card.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {card.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getPriorityColor(card.priority)}>
                          <Flag className="h-3 w-3 mr-1" />
                          {getPriorityLabel(card.priority)}
                        </Badge>
                        
                        {card.assignee && (
                          <Badge variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {card.assignee}
                          </Badge>
                        )}
                      </div>
                      
                      {card.dueDate && (
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {column.cards.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    Nenhum card nesta coluna
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* New Card Dialog */}
      <NewCardDialog
        open={showNewCardDialog}
        onOpenChange={setShowNewCardDialog}
        onSubmit={(card) => {
          addCard(selectedColumn, card);
          setShowNewCardDialog(false);
        }}
      />

      {/* Edit Card Dialog */}
      {editingCard && (
        <EditCardDialog
          card={editingCard}
          onSave={(updates) => {
            const columnId = columns.find(col => 
              col.cards.some(c => c.id === editingCard.id)
            )?.id;
            
            if (columnId) {
              updateCard(columnId, editingCard.id, updates);
            }
            setEditingCard(null);
          }}
          onClose={() => setEditingCard(null)}
        />
      )}
    </div>
  );
};

// Component for new card dialog
const NewCardDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (card: Omit<KanbanCard, 'id'>) => void;
}> = ({ open, onOpenChange, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      priority,
      assignee,
      dueDate,
      tags: []
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setAssignee('');
    setDueDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Card</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o card"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-2 border rounded"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Responsável</label>
              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Data de Vencimento</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Criar Card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component for edit card dialog
const EditCardDialog: React.FC<{
  card: KanbanCard;
  onSave: (updates: Partial<KanbanCard>) => void;
  onClose: () => void;
}> = ({ card, onSave, onClose }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority);
  const [assignee, setAssignee] = useState(card.assignee || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');

  const handleSave = () => {
    onSave({
      title,
      description,
      priority,
      assignee,
      dueDate
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Card</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do card"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o card"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-2 border rounded"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Responsável</label>
              <Input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Data de Vencimento</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanEditor;
