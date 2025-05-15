
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";

interface ConditionEditorProps {
  sessionId: string;
}

const conditionTypes = [
  { id: "first_message", name: "Primeira mensagem (total)" },
  { id: "first_daily", name: "Primeira mensagem do dia" },
  { id: "keyword", name: "Palavra-chave" },
  { id: "time_based", name: "Baseado em horário" },
  { id: "custom", name: "Condição personalizada" },
];

interface Condition {
  id: string;
  type: string;
  value: string;
  operator?: string;
}

const ConditionEditor = ({ sessionId }: ConditionEditorProps) => {
  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", type: "keyword", value: "suporte" },
    { id: "2", type: "first_daily", value: "true" },
  ]);
  
  const handleAddCondition = () => {
    const newCondition = {
      id: `condition-${Date.now()}`,
      type: "keyword",
      value: ""
    };
    setConditions([...conditions, newCondition]);
  };
  
  const handleRemoveCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };
  
  const handleChangeConditionType = (id: string, type: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, type } : c
    ));
  };
  
  const handleChangeConditionValue = (id: string, value: string) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, value } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Editor de Condições</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Configure as condições que ativam cada resposta automática
        </p>
      </div>
      
      <div className="space-y-4">
        {conditions.map((condition) => (
          <div key={condition.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Condição</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveCondition(condition.id)}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Tipo de condição</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={condition.type}
                  onChange={(e) => handleChangeConditionType(condition.id, e.target.value)}
                >
                  {conditionTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              {condition.type === "keyword" ? (
                <div>
                  <label className="text-sm font-medium mb-1 block">Palavra-chave</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={condition.value}
                    onChange={(e) => handleChangeConditionValue(condition.id, e.target.value)}
                    placeholder="Ex: promoção, ajuda, suporte"
                  />
                </div>
              ) : condition.type === "time_based" ? (
                <div>
                  <label className="text-sm font-medium mb-1 block">Horário</label>
                  <input 
                    type="time" 
                    className="w-full p-2 border rounded-md"
                    value={condition.value}
                    onChange={(e) => handleChangeConditionValue(condition.id, e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium mb-1 block">Valor</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    value={condition.value}
                    onChange={(e) => handleChangeConditionValue(condition.id, e.target.value)}
                    placeholder="Valor da condição"
                  />
                </div>
              )}
            </div>
            
            {condition.type === "custom" && (
              <div className="mt-4">
                <label className="text-sm font-medium mb-1 block">Expressão personalizada</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Digite a expressão personalizada"
                />
              </div>
            )}
          </div>
        ))}
        
        <Button variant="outline" onClick={handleAddCondition}>
          <Plus size={16} className="mr-2" /> Adicionar condição
        </Button>
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Condições</Button>
      </div>
    </div>
  );
};

export default ConditionEditor;
