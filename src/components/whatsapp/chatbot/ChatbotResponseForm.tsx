
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import { ChatbotResponse } from './ChatbotManager';

interface ChatbotResponseFormProps {
  onSave: (data: Partial<ChatbotResponse>) => void;
  onCancel: () => void;
}

const ChatbotResponseForm: React.FC<ChatbotResponseFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ChatbotResponse>>({
    trigger_type: 'keyword',
    trigger_value: '',
    response_content: '',
    response_type: 'text',
    delay_seconds: 1,
    active: true
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="trigger_type">Tipo de Gatilho</Label>
          <Select
            value={formData.trigger_type}
            onValueChange={(value) => handleChange('trigger_type', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo de gatilho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="keyword">Palavra-chave</SelectItem>
              <SelectItem value="welcome">Boas-vindas</SelectItem>
              <SelectItem value="fallback">Fallback (padrão)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.trigger_type === 'keyword' && (
          <div>
            <Label htmlFor="trigger_value">Palavra-chave</Label>
            <Input 
              id="trigger_value"
              value={formData.trigger_value || ''}
              onChange={(e) => handleChange('trigger_value', e.target.value)}
              placeholder="Ex: preços, horários, atendimento"
            />
          </div>
        )}

        <div>
          <Label htmlFor="response_type">Tipo de Resposta</Label>
          <Select
            value={formData.response_type}
            onValueChange={(value) => handleChange('response_type', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo de resposta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="image">Imagem</SelectItem>
              <SelectItem value="button">Botões</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="response_content">Resposta</Label>
          <Textarea 
            id="response_content"
            value={formData.response_content || ''}
            onChange={(e) => handleChange('response_content', e.target.value)}
            placeholder="Digite a resposta que será enviada"
            rows={5}
          />
        </div>

        {formData.response_type === 'image' && (
          <div>
            <Label htmlFor="media_url">URL da Imagem</Label>
            <Input 
              id="media_url"
              value={formData.media_url || ''}
              onChange={(e) => handleChange('media_url', e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
        )}

        <div>
          <Label htmlFor="delay_seconds">Atraso (segundos)</Label>
          <Input 
            id="delay_seconds"
            type="number"
            min="0"
            max="60"
            value={formData.delay_seconds || 0}
            onChange={(e) => handleChange('delay_seconds', parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tempo de espera antes de enviar a resposta
          </p>
        </div>
      </div>

      <CardFooter className="px-0 pt-4 flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Resposta
        </Button>
      </CardFooter>
    </form>
  );
};

export default ChatbotResponseForm;
