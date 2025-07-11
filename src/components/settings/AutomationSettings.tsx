
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, X, ArrowRight, Save, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface AutomationCondition {
  field: string;
  operator: string;
  value: string;
}

interface AutomationAction {
  type: string;
  value: string;
  data?: any;
}

interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  trigger: string;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  created_at?: string;
}

const AutomationSettings = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showNewRule, setShowNewRule] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    active: true,
    trigger: 'lead_created',
    conditions: [{ field: 'status', operator: 'equals', value: '' }],
    actions: [{ type: 'move_stage', value: '' }]
  });

  useEffect(() => {
    loadAutomationRules();
  }, [user?.id]);

  const loadAutomationRules = async () => {
    if (!user?.id || !company?.id) return;

    try {
      const { data } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', company.id);

      if (data) {
        const parsedRules = data.map(item => ({
          id: item.id,
          name: item.rules?.name || 'Regra sem nome',
          description: item.rules?.description || '',
          active: item.rules?.active ?? true,
          trigger: item.rules?.trigger || 'lead_created',
          conditions: item.rules?.conditions || [],
          actions: item.rules?.actions || [],
          created_at: item.created_at
        }));
        setRules(parsedRules);
      }
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
    }
  };

  const saveRule = async (rule: Partial<AutomationRule>) => {
    if (!user?.id || !company?.id) return;

    setIsLoading(true);
    try {
      const ruleData = {
        user_id: user.id,
        company_id: company.id,
        rules: {
          name: rule.name,
          description: rule.description,
          active: rule.active,
          trigger: rule.trigger,
          conditions: rule.conditions,
          actions: rule.actions
        }
      };

      let error;
      if (editingRule) {
        ({ error } = await supabase
          .from('automation_rules')
          .update(ruleData)
          .eq('id', editingRule.id));
      } else {
        ({ error } = await supabase
          .from('automation_rules')
          .insert(ruleData));
      }

      if (error) throw error;

      toast({
        title: editingRule ? 'Regra atualizada' : 'Regra criada',
        description: 'A regra de automação foi salva com sucesso.'
      });

      setShowNewRule(false);
      setEditingRule(null);
      setNewRule({
        name: '',
        description: '',
        active: true,
        trigger: 'lead_created',
        conditions: [{ field: 'status', operator: 'equals', value: '' }],
        actions: [{ type: 'move_stage', value: '' }]
      });
      loadAutomationRules();
    } catch (error) {
      console.error('Erro ao salvar regra:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a regra.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Regra removida',
        description: 'A regra de automação foi removida com sucesso.'
      });
      loadAutomationRules();
    } catch (error) {
      console.error('Erro ao remover regra:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a regra.',
        variant: 'destructive'
      });
    }
  };

  const toggleRuleActive = async (rule: AutomationRule) => {
    const updatedRule = { ...rule, active: !rule.active };
    await saveRule(updatedRule);
  };

  const addCondition = () => {
    setNewRule(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), { field: 'status', operator: 'equals', value: '' }]
    }));
  };

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [...(prev.actions || []), { type: 'move_stage', value: '' }]
    }));
  };

  const updateCondition = (index: number, updates: Partial<AutomationCondition>) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions?.map((cond, i) => 
        i === index ? { ...cond, ...updates } : cond
      ) || []
    }));
  };

  const updateAction = (index: number, updates: Partial<AutomationAction>) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions?.map((action, i) => 
        i === index ? { ...action, ...updates } : action
      ) || []
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <div>
              <CardTitle>Automação de Fluxo</CardTitle>
              <CardDescription>
                Configure regras para automatizar ações baseadas em eventos
              </CardDescription>
            </div>
          </div>
          <Button onClick={() => setShowNewRule(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lista de regras existentes */}
        <div className="space-y-4">
          {rules.map(rule => (
            <Card key={rule.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{rule.name}</h3>
                    <Badge variant={rule.active ? "default" : "secondary"}>
                      {rule.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  {rule.description && (
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Trigger: {rule.trigger}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{rule.conditions.length} condições</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{rule.actions.length} ações</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleRuleActive(rule)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRule(rule);
                      setNewRule(rule);
                      setShowNewRule(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Formulário de nova regra */}
        {showNewRule && (
          <Card className="p-4 border-2 border-dashed">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {editingRule ? 'Editar Regra' : 'Nova Regra de Automação'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowNewRule(false);
                    setEditingRule(null);
                    setNewRule({
                      name: '',
                      description: '',
                      active: true,
                      trigger: 'lead_created',
                      conditions: [{ field: 'status', operator: 'equals', value: '' }],
                      actions: [{ type: 'move_stage', value: '' }]
                    });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Regra</Label>
                  <Input
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Mover leads qualificados"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trigger</Label>
                  <Select
                    value={newRule.trigger}
                    onValueChange={(value) => setNewRule(prev => ({ ...prev, trigger: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead_created">Lead Criado</SelectItem>
                      <SelectItem value="lead_updated">Lead Atualizado</SelectItem>
                      <SelectItem value="task_completed">Tarefa Concluída</SelectItem>
                      <SelectItem value="client_created">Cliente Criado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={newRule.description || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o que esta regra faz..."
                />
              </div>

              {/* Condições */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Condições</Label>
                  <Button variant="outline" size="sm" onClick={addCondition}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Condição
                  </Button>
                </div>
                {newRule.conditions?.map((condition, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded">
                    <Select
                      value={condition.field}
                      onValueChange={(value) => updateCondition(index, { field: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="source">Origem</SelectItem>
                        <SelectItem value="value">Valor</SelectItem>
                        <SelectItem value="priority">Prioridade</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(index, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">É igual a</SelectItem>
                        <SelectItem value="not_equals">Não é igual a</SelectItem>
                        <SelectItem value="contains">Contém</SelectItem>
                        <SelectItem value="greater_than">Maior que</SelectItem>
                        <SelectItem value="less_than">Menor que</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(index, { value: e.target.value })}
                      placeholder="Valor"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewRule(prev => ({
                          ...prev,
                          conditions: prev.conditions?.filter((_, i) => i !== index) || []
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Ações</Label>
                  <Button variant="outline" size="sm" onClick={addAction}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Ação
                  </Button>
                </div>
                {newRule.actions?.map((action, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded">
                    <Select
                      value={action.type}
                      onValueChange={(value) => updateAction(index, { type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="move_stage">Mover Etapa</SelectItem>
                        <SelectItem value="assign_user">Atribuir Usuário</SelectItem>
                        <SelectItem value="add_tag">Adicionar Selo</SelectItem>
                        <SelectItem value="create_task">Criar Tarefa</SelectItem>
                        <SelectItem value="send_email">Enviar Email</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={action.value}
                      onChange={(e) => updateAction(index, { value: e.target.value })}
                      placeholder="Valor da ação"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewRule(prev => ({
                          ...prev,
                          actions: prev.actions?.filter((_, i) => i !== index) || []
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowNewRule(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => saveRule(newRule)} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : editingRule ? 'Atualizar' : 'Criar Regra'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {rules.length === 0 && !showNewRule && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma regra de automação configurada</p>
            <p className="text-sm">Crie sua primeira regra para automatizar processos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomationSettings;
