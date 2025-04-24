
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, X, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AutomationRule = {
  id: string;
  condition: {
    field: string;
    operator: string;
    value: string;
  };
  action: {
    type: string;
    value: string;
  };
};

const AutomationSettings = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showNewRule, setShowNewRule] = useState(false);
  const { toast } = useToast();

  const [condition, setCondition] = useState({
    field: "status",
    operator: "equals",
    value: ""
  });

  const [action, setAction] = useState({
    type: "move",
    value: ""
  });

  const addRule = () => {
    if (!condition.value || !action.value) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos para adicionar a regra",
        variant: "destructive"
      });
      return;
    }

    const newRule: AutomationRule = {
      id: Date.now().toString(),
      condition: { ...condition },
      action: { ...action }
    };

    setRules([...rules, newRule]);
    setShowNewRule(false);
    
    // Reset form
    setCondition({
      field: "status",
      operator: "equals",
      value: ""
    });
    
    setAction({
      type: "move",
      value: ""
    });

    toast({
      title: "Regra adicionada",
      description: "A regra de automação foi adicionada com sucesso",
    });
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "Regra removida",
      description: "A regra de automação foi removida com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automação de Fluxo</CardTitle>
        <CardDescription>
          Configure regras para mover leads, adicionar tarefas e atribuir responsáveis automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {rules.map(rule => (
            <div key={rule.id} className="p-4 border rounded-md relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => removeRule(rule.id)}
              >
                <X size={14} />
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="font-medium text-sm">SE</div>
                <div className="px-2 py-1 bg-muted rounded text-sm">
                  {rule.condition.field} {rule.condition.operator} "{rule.condition.value}"
                </div>
                <ArrowRight size={16} className="mx-2 text-muted-foreground hidden sm:block" />
                <div className="font-medium text-sm">ENTÃO</div>
                <div className="px-2 py-1 bg-muted rounded text-sm">
                  {rule.action.type === "move" ? "Mover para" : 
                   rule.action.type === "assign" ? "Atribuir para" : 
                   rule.action.type === "tag" ? "Adicionar selo" : "Adicionar tarefa"}: "{rule.action.value}"
                </div>
              </div>
            </div>
          ))}

          {rules.length === 0 && !showNewRule && (
            <div className="text-center py-6 text-muted-foreground">
              Nenhuma regra de automação configurada
            </div>
          )}

          {showNewRule && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Nova Regra de Automação</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-sm mb-2">Condição</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="condition-field" className="text-xs">Campo</Label>
                      <Select 
                        value={condition.field}
                        onValueChange={(value) => setCondition({...condition, field: value})}
                      >
                        <SelectTrigger id="condition-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="source">Origem</SelectItem>
                          <SelectItem value="value">Valor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="condition-operator" className="text-xs">Operador</Label>
                      <Select 
                        value={condition.operator}
                        onValueChange={(value) => setCondition({...condition, operator: value})}
                      >
                        <SelectTrigger id="condition-operator">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">É igual a</SelectItem>
                          <SelectItem value="not-equals">Não é igual a</SelectItem>
                          <SelectItem value="contains">Contém</SelectItem>
                          <SelectItem value="greater-than">Maior que</SelectItem>
                          <SelectItem value="less-than">Menor que</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="condition-value" className="text-xs">Valor</Label>
                      <Input 
                        id="condition-value" 
                        value={condition.value}
                        onChange={(e) => setCondition({...condition, value: e.target.value})}
                        placeholder="Ex: Novo Lead"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-sm mb-2">Ação</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="action-type" className="text-xs">Tipo de Ação</Label>
                      <Select 
                        value={action.type}
                        onValueChange={(value) => setAction({...action, type: value})}
                      >
                        <SelectTrigger id="action-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="move">Mover para</SelectItem>
                          <SelectItem value="assign">Atribuir para</SelectItem>
                          <SelectItem value="tag">Adicionar selo</SelectItem>
                          <SelectItem value="task">Adicionar tarefa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="action-value" className="text-xs">Valor</Label>
                      <Input 
                        id="action-value" 
                        value={action.value}
                        onChange={(e) => setAction({...action, value: e.target.value})}
                        placeholder={
                          action.type === "move" ? "Ex: Em Negociação" : 
                          action.type === "assign" ? "Ex: João Silva" : 
                          action.type === "tag" ? "Ex: Prioritário" : 
                          "Ex: Entrar em contato"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowNewRule(false)}>Cancelar</Button>
                <Button onClick={addRule}>Adicionar Regra</Button>
              </div>
            </div>
          )}
        </div>
        
        {!showNewRule && (
          <Button 
            onClick={() => setShowNewRule(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle size={16} />
            Adicionar Regra
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomationSettings;
