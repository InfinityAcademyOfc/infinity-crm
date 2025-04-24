
import { useState } from "react";
import { Plus, Edit, Trash, Clock, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Automation {
  id: string;
  name: string;
  type: 'welcome' | 'scheduled' | 'reply';
  message: string;
  active: boolean;
  trigger?: string;
  schedule?: string;
  expanded?: boolean;
}

const mockAutomations: Automation[] = [
  {
    id: "1",
    name: "Mensagem de Boas-vindas",
    type: "welcome",
    message: "Olá! Obrigado por entrar em contato. Como posso ajudar?",
    active: true
  },
  {
    id: "2",
    name: "Mensagem Fora do Expediente",
    type: "reply",
    message: "Obrigado pelo contato! Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Retornaremos assim que possível.",
    trigger: "fora do expediente",
    active: true
  },
  {
    id: "3",
    name: "Lembrete de Reunião",
    type: "scheduled",
    message: "Lembrete: Você tem uma reunião agendada para amanhã às 14h. Por favor confirme sua presença.",
    schedule: "08:00",
    active: false
  }
];

const WhatsAppAutomation = () => {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [isNewAutomationOpen, setIsNewAutomationOpen] = useState(false);
  const [isEditAutomationOpen, setIsEditAutomationOpen] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState<Automation | null>(null);
  const [automationType, setAutomationType] = useState<'welcome' | 'scheduled' | 'reply'>('welcome');
  const { toast } = useToast();

  const handleToggleAutomation = (id: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id ? { ...auto, active: !auto.active } : auto
      )
    );
    
    const automation = automations.find(a => a.id === id);
    if (automation) {
      toast({
        title: `Automação ${automation.active ? 'desativada' : 'ativada'}`,
        description: `"${automation.name}" foi ${automation.active ? 'desativada' : 'ativada'} com sucesso.`,
      });
    }
  };

  const handleToggleExpand = (id: string) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id ? { ...auto, expanded: !auto.expanded } : auto
      )
    );
  };

  const handleEditAutomation = (automation: Automation) => {
    setCurrentAutomation(automation);
    setAutomationType(automation.type);
    setIsEditAutomationOpen(true);
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(auto => auto.id !== id));
    
    toast({
      title: "Automação removida",
      description: "A automação foi removida com sucesso.",
    });
  };

  const handleSaveAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const trigger = formData.get("trigger") as string;
    const schedule = formData.get("schedule") as string;
    
    if (!name || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const newAutomation: Automation = {
      id: Date.now().toString(),
      name,
      type: automationType,
      message,
      active: true
    };
    
    if (automationType === 'reply' && trigger) {
      newAutomation.trigger = trigger;
    }
    
    if (automationType === 'scheduled' && schedule) {
      newAutomation.schedule = schedule;
    }
    
    setAutomations(prev => [...prev, newAutomation]);
    setIsNewAutomationOpen(false);
    
    toast({
      title: "Automação criada",
      description: "A automação foi criada com sucesso.",
    });
  };

  const handleUpdateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAutomation) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    const trigger = formData.get("trigger") as string;
    const schedule = formData.get("schedule") as string;
    
    if (!name || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedAutomation: Automation = {
      ...currentAutomation,
      name,
      type: automationType,
      message
    };
    
    if (automationType === 'reply') {
      updatedAutomation.trigger = trigger;
      delete updatedAutomation.schedule;
    } else if (automationType === 'scheduled') {
      updatedAutomation.schedule = schedule;
      delete updatedAutomation.trigger;
    } else {
      delete updatedAutomation.trigger;
      delete updatedAutomation.schedule;
    }
    
    setAutomations(prev =>
      prev.map(auto => (auto.id === currentAutomation.id ? updatedAutomation : auto))
    );
    
    setIsEditAutomationOpen(false);
    
    toast({
      title: "Automação atualizada",
      description: "A automação foi atualizada com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Automações do WhatsApp</h3>
        <Button onClick={() => setIsNewAutomationOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      <div className="space-y-4">
        {automations.map((automation) => (
          <div key={automation.id} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                {automation.type === 'welcome' && (
                  <MessageSquare className="h-5 w-5 mr-3 text-blue-500" />
                )}
                {automation.type === 'scheduled' && (
                  <Clock className="h-5 w-5 mr-3 text-purple-500" />
                )}
                {automation.type === 'reply' && (
                  <MessageSquare className="h-5 w-5 mr-3 text-green-500" />
                )}
                <div>
                  <h4 className="font-medium">{automation.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {automation.type === 'welcome' && 'Mensagem de boas-vindas'}
                    {automation.type === 'scheduled' && `Agendada para ${automation.schedule}`}
                    {automation.type === 'reply' && `Resposta automática: "${automation.trigger}"`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={automation.active} 
                    onCheckedChange={() => handleToggleAutomation(automation.id)} 
                    aria-label="Toggle automation"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {automation.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleToggleExpand(automation.id)}>
                  {automation.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
              </div>
            </div>
            
            {automation.expanded && (
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                <div className="mb-4">
                  <h5 className="text-sm font-medium mb-2">Mensagem:</h5>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-md border text-sm">
                    {automation.message}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditAutomation(automation)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteAutomation(automation.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {automations.length === 0 && (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Nenhuma automação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Crie automações para responder mensagens automaticamente
            </p>
            <Button onClick={() => setIsNewAutomationOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Automação
            </Button>
          </div>
        )}
      </div>

      {/* New Automation Dialog */}
      <Dialog open={isNewAutomationOpen} onOpenChange={setIsNewAutomationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Automação</DialogTitle>
            <DialogDescription>
              Crie uma nova automação para mensagens do WhatsApp.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSaveAutomation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Automação*</Label>
              <Input id="name" name="name" placeholder="Ex: Mensagem de Boas-vindas" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Automação*</Label>
              <Select name="type" value={automationType} onValueChange={(value: any) => setAutomationType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Mensagem de Boas-vindas</SelectItem>
                  <SelectItem value="reply">Resposta Automática</SelectItem>
                  <SelectItem value="scheduled">Mensagem Agendada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {automationType === 'reply' && (
              <div className="space-y-2">
                <Label htmlFor="trigger">Palavras-chave de Gatilho*</Label>
                <Input 
                  id="trigger" 
                  name="trigger" 
                  placeholder="Ex: preço, horário, atendimento" 
                  required={automationType === 'reply'}
                />
                <p className="text-xs text-gray-500">Separe as palavras-chave por vírgulas.</p>
              </div>
            )}
            
            {automationType === 'scheduled' && (
              <div className="space-y-2">
                <Label htmlFor="schedule">Horário de Envio*</Label>
                <Input 
                  id="schedule" 
                  name="schedule" 
                  type="time" 
                  required={automationType === 'scheduled'}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem*</Label>
              <Textarea 
                id="message" 
                name="message" 
                placeholder="Digite a mensagem da automação..." 
                rows={4}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewAutomationOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Automação</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Automation Dialog */}
      <Dialog open={isEditAutomationOpen} onOpenChange={setIsEditAutomationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Automação</DialogTitle>
            <DialogDescription>
              Modifique as configurações da automação.
            </DialogDescription>
          </DialogHeader>
          
          {currentAutomation && (
            <form onSubmit={handleUpdateAutomation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Automação*</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={currentAutomation.name} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Automação*</Label>
                <Select 
                  name="type" 
                  value={automationType} 
                  onValueChange={(value: any) => setAutomationType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Mensagem de Boas-vindas</SelectItem>
                    <SelectItem value="reply">Resposta Automática</SelectItem>
                    <SelectItem value="scheduled">Mensagem Agendada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {automationType === 'reply' && (
                <div className="space-y-2">
                  <Label htmlFor="trigger">Palavras-chave de Gatilho*</Label>
                  <Input 
                    id="trigger" 
                    name="trigger" 
                    defaultValue={currentAutomation.trigger} 
                    placeholder="Ex: preço, horário, atendimento" 
                    required={automationType === 'reply'}
                  />
                  <p className="text-xs text-gray-500">Separe as palavras-chave por vírgulas.</p>
                </div>
              )}
              
              {automationType === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="schedule">Horário de Envio*</Label>
                  <Input 
                    id="schedule" 
                    name="schedule" 
                    type="time" 
                    defaultValue={currentAutomation.schedule} 
                    required={automationType === 'scheduled'}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem*</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  defaultValue={currentAutomation.message} 
                  rows={4}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditAutomationOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Atualizar Automação</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhatsAppAutomation;
