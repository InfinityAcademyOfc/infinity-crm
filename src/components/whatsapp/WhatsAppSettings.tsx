
import { useState } from "react";
import { Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const WhatsAppSettings = () => {
  const [businessHours, setBusinessHours] = useState({
    monday: { enabled: true, start: "09:00", end: "18:00" },
    tuesday: { enabled: true, start: "09:00", end: "18:00" },
    wednesday: { enabled: true, start: "09:00", end: "18:00" },
    thursday: { enabled: true, start: "09:00", end: "18:00" },
    friday: { enabled: true, start: "09:00", end: "18:00" },
    saturday: { enabled: false, start: "09:00", end: "13:00" },
    sunday: { enabled: false, start: "09:00", end: "13:00" },
  });
  const [greetingMessage, setGreetingMessage] = useState(
    "Olá! Obrigado por entrar em contato com nossa empresa. Como posso ajudar?"
  );
  const [awayMessage, setAwayMessage] = useState(
    "Obrigado pelo contato! Estamos fora do horário de atendimento no momento. Retornaremos sua mensagem assim que possível. Horário de atendimento: Segunda a Sexta, das 9h às 18h."
  );
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const [syncContactsEnabled, setSyncContactsEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Disponível para atendimento");
  const { toast } = useToast();

  const handleBusinessHoursChange = (
    day: string,
    field: "enabled" | "start" | "end",
    value: boolean | string
  ) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save settings to backend
    toast({
      title: "Configurações salvas",
      description: "As configurações do WhatsApp foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start">
        <Info className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-sm text-blue-800 dark:text-blue-300">
          Configure as opções do WhatsApp Business para otimizar sua comunicação com clientes.
          Alterações nas configurações serão aplicadas imediatamente à sua conta conectada.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="general">
          <AccordionTrigger className="text-lg font-medium">
            Configurações Gerais
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium">
                  Notificações
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receber notificações de novas mensagens
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationEnabled}
                onCheckedChange={setNotificationEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoResponse" className="font-medium">
                  Respostas Automáticas
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enviar respostas automáticas quando fora do expediente
                </p>
              </div>
              <Switch
                id="autoResponse"
                checked={autoResponseEnabled}
                onCheckedChange={setAutoResponseEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="syncContacts" className="font-medium">
                  Sincronização de Contatos
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sincronizar contatos do WhatsApp com o CRM
                </p>
              </div>
              <Switch
                id="syncContacts"
                checked={syncContactsEnabled}
                onCheckedChange={setSyncContactsEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusMessage" className="font-medium">
                Mensagem de Status
              </Label>
              <Input
                id="statusMessage"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Esta mensagem será exibida no seu perfil do WhatsApp Business
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="business-hours">
          <AccordionTrigger className="text-lg font-medium">
            Horário de Funcionamento
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-32">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${day}-enabled`}
                      checked={hours.enabled}
                      onCheckedChange={(checked) =>
                        handleBusinessHoursChange(day, "enabled", checked)
                      }
                    />
                    <Label htmlFor={`${day}-enabled`} className="capitalize">
                      {day}
                    </Label>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      htmlFor={`${day}-start`}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Início
                    </Label>
                    <Input
                      id={`${day}-start`}
                      type="time"
                      value={hours.start}
                      onChange={(e) =>
                        handleBusinessHoursChange(day, "start", e.target.value)
                      }
                      disabled={!hours.enabled}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor={`${day}-end`}
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Fim
                    </Label>
                    <Input
                      id={`${day}-end`}
                      type="time"
                      value={hours.end}
                      onChange={(e) =>
                        handleBusinessHoursChange(day, "end", e.target.value)
                      }
                      disabled={!hours.enabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="messages">
          <AccordionTrigger className="text-lg font-medium">
            Mensagens Automáticas
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="greetingMessage" className="font-medium">
                Mensagem de Saudação
              </Label>
              <Textarea
                id="greetingMessage"
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Esta mensagem é enviada automaticamente quando um cliente inicia uma conversa durante o horário de funcionamento.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="awayMessage" className="font-medium">
                Mensagem de Ausência
              </Label>
              <Textarea
                id="awayMessage"
                value={awayMessage}
                onChange={(e) => setAwayMessage(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Esta mensagem é enviada automaticamente quando um cliente envia uma mensagem fora do horário de funcionamento.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="labels">
          <AccordionTrigger className="text-lg font-medium">
            Etiquetas e Categorias
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="defaultLabel" className="font-medium">
                Etiqueta Padrão para Novos Contatos
              </Label>
              <Select defaultValue="novo">
                <SelectTrigger id="defaultLabel">
                  <SelectValue placeholder="Selecione uma etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo Lead</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="parceiro">Parceiro</SelectItem>
                  <SelectItem value="fornecedor">Fornecedor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoLabel" className="font-medium">
                Categorização Automática
              </Label>
              <Select defaultValue="ativo">
                <SelectTrigger id="autoLabel">
                  <SelectValue placeholder="Configurar categorização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativado</SelectItem>
                  <SelectItem value="manual">Apenas Manual</SelectItem>
                  <SelectItem value="desativado">Desativado</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Categoriza automaticamente contatos com base no histórico de mensagens e padrões de comunicação.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="pt-4 flex justify-end">
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default WhatsAppSettings;
