
import { useState } from "react";
import { ArrowRight, Info, Save, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FieldMapping {
  id: string;
  source: string;
  target: string;
}

const LeadMappingConfig = () => {
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { id: "1", source: "full_name", target: "name" },
    { id: "2", source: "email", target: "email" },
    { id: "3", source: "phone_number", target: "phone" },
  ]);
  const [autoTag, setAutoTag] = useState(true);
  const [notifyNewLeads, setNotifyNewLeads] = useState(true);
  const [defaultStage, setDefaultStage] = useState("prospecting");
  const [defaultAssignee, setDefaultAssignee] = useState("unassigned");
  const { toast } = useToast();

  const handleAddMapping = () => {
    const newMapping: FieldMapping = {
      id: Date.now().toString(),
      source: "",
      target: "",
    };
    setFieldMappings([...fieldMappings, newMapping]);
  };

  const handleRemoveMapping = (id: string) => {
    setFieldMappings(fieldMappings.filter(mapping => mapping.id !== id));
  };

  const handleUpdateMapping = (id: string, field: 'source' | 'target', value: string) => {
    setFieldMappings(fieldMappings.map(mapping => 
      mapping.id === id ? { ...mapping, [field]: value } : mapping
    ));
  };

  const handleSaveConfig = () => {
    // Here would typically save to backend
    toast({
      title: "Configuração salva",
      description: "Mapeamento de campos configurado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
        <Info className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium mb-1">Mapeamento de Campos</h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Configure como os campos das plataformas de anúncios serão mapeados para os campos do seu CRM.
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Mapeamento de Campos de Lead</h3>
          
          <div className="space-y-3">
            {fieldMappings.map(mapping => (
              <div key={mapping.id} className="flex items-center gap-3">
                <Select
                  value={mapping.source}
                  onValueChange={(value) => handleUpdateMapping(mapping.id, 'source', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Campo de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_name">Nome Completo</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone_number">Telefone</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                    <SelectItem value="job_title">Cargo</SelectItem>
                    <SelectItem value="address">Endereço</SelectItem>
                    <SelectItem value="city">Cidade</SelectItem>
                    <SelectItem value="country">País</SelectItem>
                    <SelectItem value="custom_field">Campo Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                
                <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
                
                <Select
                  value={mapping.target}
                  onValueChange={(value) => handleUpdateMapping(mapping.id, 'target', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Campo do CRM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                    <SelectItem value="position">Cargo</SelectItem>
                    <SelectItem value="address">Endereço</SelectItem>
                    <SelectItem value="city">Cidade</SelectItem>
                    <SelectItem value="country">País</SelectItem>
                    <SelectItem value="custom_field">Campo Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMapping(mapping.id)}
                >
                  <Trash size={18} className="text-red-500" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" onClick={handleAddMapping} className="w-full mt-2">
              <Plus size={16} className="mr-2" />
              Adicionar Campo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Destino</h3>
            
            <div className="space-y-2">
              <Label htmlFor="defaultStage">Estágio Padrão</Label>
              <Select value={defaultStage} onValueChange={setDefaultStage}>
                <SelectTrigger id="defaultStage">
                  <SelectValue placeholder="Selecione o estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospecting">Prospecção</SelectItem>
                  <SelectItem value="qualification">Qualificação</SelectItem>
                  <SelectItem value="proposal">Proposta</SelectItem>
                  <SelectItem value="negotiation">Negociação</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Os leads importados serão adicionados a este estágio no funil de vendas
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultAssignee">Atribuir Para</Label>
              <Select value={defaultAssignee} onValueChange={setDefaultAssignee}>
                <SelectTrigger id="defaultAssignee">
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Não atribuído</SelectItem>
                  <SelectItem value="round_robin">Rotativo entre equipe</SelectItem>
                  <SelectItem value="user_1">Carlos Silva</SelectItem>
                  <SelectItem value="user_2">Maria Oliveira</SelectItem>
                  <SelectItem value="user_3">João Santos</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Determina quem será responsável pelos leads importados
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Opções Adicionais</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoTag" className="font-medium">
                  Tag Automática de Fonte
                </Label>
                <p className="text-sm text-gray-500">
                  Adicionar automaticamente tags indicando a origem do lead
                </p>
              </div>
              <Switch
                id="autoTag"
                checked={autoTag}
                onCheckedChange={setAutoTag}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifyNewLeads" className="font-medium">
                  Notificações
                </Label>
                <p className="text-sm text-gray-500">
                  Enviar notificações quando novos leads forem importados
                </p>
              </div>
              <Switch
                id="notifyNewLeads"
                checked={notifyNewLeads}
                onCheckedChange={setNotifyNewLeads}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scoreThreshold">Pontuação Mínima (Score)</Label>
              <Input 
                id="scoreThreshold"
                type="number"
                min="0"
                max="100" 
                defaultValue="50"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Apenas leads com pontuação acima deste valor serão importados (0-100)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 flex justify-end">
        <Button onClick={handleSaveConfig} className="w-40">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </div>
  );
};

export default LeadMappingConfig;
