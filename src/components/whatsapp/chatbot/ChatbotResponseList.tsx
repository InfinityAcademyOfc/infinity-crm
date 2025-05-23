
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Image, MessageSquare, Bot } from "lucide-react";
import { ChatbotResponse } from './ChatbotManager';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ChatbotResponseListProps {
  responses: ChatbotResponse[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const ChatbotResponseList: React.FC<ChatbotResponseListProps> = ({
  responses,
  isLoading,
  onDelete,
  onToggleActive
}) => {
  // Formatar o tipo de gatilho para exibição
  const getTriggerTypeDisplay = (type: string) => {
    switch (type) {
      case 'keyword': return 'Palavra-chave';
      case 'welcome': return 'Boas-vindas';
      case 'fallback': return 'Fallback';
      default: return type;
    }
  };

  // Ícone com base no tipo de resposta
  const getResponseTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'button': return <Bot size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando respostas...</p>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma resposta automática configurada</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Tipo</TableHead>
            <TableHead>Gatilho</TableHead>
            <TableHead>Resposta</TableHead>
            <TableHead className="text-center w-[100px]">Ativo</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response.id}>
              <TableCell>
                <Badge variant={response.active ? "default" : "outline"} className="flex items-center gap-1">
                  {getResponseTypeIcon(response.response_type)}
                  {getTriggerTypeDisplay(response.trigger_type)}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {response.trigger_type === 'keyword' ? response.trigger_value : '-'}
              </TableCell>
              <TableCell className="max-w-[300px] truncate">
                {response.response_content}
              </TableCell>
              <TableCell className="text-center">
                <Switch 
                  checked={response.active} 
                  onCheckedChange={() => onToggleActive(response.id, response.active)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(response.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ChatbotResponseList;
