
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Zap, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface AutomationRule {
  id: string;
  trigger: string;
  action: string;
  condition: string;
  enabled: boolean;
}

const AutomationSettings = () => {
  const { user, company } = useAuth();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && company) {
      loadAutomationRules();
    }
  }, [user, company]);

  const loadAutomationRules = async () => {
    if (!user || !company) return;

    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('user_id', user.id)
        .eq('company_id', company.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') throw error;
        // No rules found, use defaults
        setRules([]);
      } else if (data?.rules) {
        setRules(data.rules);
      }
    } catch (error) {
      console.error('Erro ao carregar regras:', error);
      toast.error('Erro ao carregar regras de automação');
    } finally {
      setLoading(false);
    }
  };

  const saveRules = async () => {
    if (!user || !company) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('automation_rules')
        .upsert({
          user_id: user.id,
          company_id: company.id,
          rules
        });

      if (error) throw error;
      toast.success('Regras de automação salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar regras:', error);
      toast.error('Erro ao salvar regras de automação');
    } finally {
      setSaving(false);
    }
  };

  const addRule = () => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      trigger: 'new_lead',
      action: 'send_email',
      condition: 'always',
      enabled: true
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<AutomationRule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Regras de Automação
        </CardTitle>
        <CardDescription>
          Configure automações para agilizar seu fluxo de trabalho
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Regras Ativas</h3>
          <Button onClick={addRule} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>

        {rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma regra de automação configurada</p>
            <Button variant="outline" onClick={addRule} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Regra
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Regra de Automação</h4>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(enabled) => updateRule(rule.id, { enabled })}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Gatilho</label>
                    <Select
                      value={rule.trigger}
                      onValueChange={(trigger) => updateRule(rule.id, { trigger })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new_lead">Novo Lead</SelectItem>
                        <SelectItem value="lead_updated">Lead Atualizado</SelectItem>
                        <SelectItem value="task_created">Tarefa Criada</SelectItem>
                        <SelectItem value="task_completed">Tarefa Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Ação</label>
                    <Select
                      value={rule.action}
                      onValueChange={(action) => updateRule(rule.id, { action })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_email">Enviar Email</SelectItem>
                        <SelectItem value="create_task">Criar Tarefa</SelectItem>
                        <SelectItem value="send_notification">Enviar Notificação</SelectItem>
                        <SelectItem value="update_status">Atualizar Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Condição</label>
                    <Select
                      value={rule.condition}
                      onValueChange={(condition) => updateRule(rule.id, { condition })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">Sempre</SelectItem>
                        <SelectItem value="high_priority">Alta Prioridade</SelectItem>
                        <SelectItem value="specific_source">Origem Específica</SelectItem>
                        <SelectItem value="value_above">Valor Acima de R$ 1000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button onClick={saveRules} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Regras"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationSettings;
