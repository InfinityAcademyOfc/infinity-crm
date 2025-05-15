
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AutoResponder {
  id: string;
  keyword?: string;
  response?: string;
  media_url?: string;
  trigger_type?: string;
  delay_seconds: number;
  active: boolean;
}

interface AutoResponderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autoResponder: AutoResponder | null;
  onSave: (autoResponder: Partial<AutoResponder>) => void;
  sessionId: string;
}

const AutoResponderFormDialog = ({ 
  open, 
  onOpenChange, 
  autoResponder, 
  onSave,
  sessionId
}: AutoResponderFormDialogProps) => {
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [triggerType, setTriggerType] = useState<string>("keyword");
  const [delaySeconds, setDelaySeconds] = useState(1);
  
  // Reset form when autoResponder changes
  useEffect(() => {
    if (autoResponder) {
      setKeyword(autoResponder.keyword || "");
      setResponse(autoResponder.response || "");
      setMediaUrl(autoResponder.media_url || "");
      setTriggerType(autoResponder.trigger_type || "keyword");
      setDelaySeconds(autoResponder.delay_seconds || 1);
    } else {
      setKeyword("");
      setResponse("");
      setMediaUrl("");
      setTriggerType("keyword");
      setDelaySeconds(1);
    }
  }, [autoResponder, open]);
  
  const handleSave = () => {
    // Basic validation
    if (triggerType === "keyword" && !keyword.trim()) {
      return;
    }
    
    if (!response.trim() && !mediaUrl.trim()) {
      return;
    }
    
    onSave({
      keyword: keyword.trim() || undefined,
      response: response.trim() || undefined,
      media_url: mediaUrl.trim() || undefined,
      trigger_type: triggerType,
      delay_seconds: delaySeconds
      // sessionId is handled in the parent component
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {autoResponder ? "Editar Resposta Automática" : "Nova Resposta Automática"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Tipo de gatilho</Label>
            <RadioGroup
              value={triggerType}
              onValueChange={setTriggerType}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="keyword" id="keyword" />
                <Label htmlFor="keyword">Palavra-chave</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="first_message" id="first_message" />
                <Label htmlFor="first_message">Primeira mensagem (total)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="first_daily" id="first_daily" />
                <Label htmlFor="first_daily">Primeira mensagem do dia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time_based" id="time_based" />
                <Label htmlFor="time_based">Baseado em horário</Label>
              </div>
            </RadioGroup>
          </div>
          
          {triggerType === "keyword" && (
            <div>
              <Label htmlFor="keyword-input">Palavra-chave</Label>
              <Input
                id="keyword-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: preço, suporte, ajuda"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Responderá quando a mensagem contiver esta palavra-chave
              </p>
            </div>
          )}
          
          {triggerType === "time_based" && (
            <div>
              <Label htmlFor="time-input">Horário</Label>
              <Input
                id="time-input"
                type="time"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Responderá a primeira mensagem recebida neste horário
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="response">Resposta</Label>
            <Textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
              placeholder="Digite a resposta automática"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="media-url">URL de mídia (opcional)</Label>
            <Input
              id="media-url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="delay">Delay antes de responder (segundos)</Label>
            <Input
              id="delay"
              type="number"
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 0)}
              min="0"
              max="30"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Aguarda alguns segundos antes de enviar a resposta automática (simula digitação humana)
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            {autoResponder ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoResponderFormDialog;
