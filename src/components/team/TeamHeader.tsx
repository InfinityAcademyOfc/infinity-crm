
import React from "react";
import { Search, Download, Plus } from "lucide-react";
import { SectionHeader, ActionButton } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TeamHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TeamHeader = ({ searchQuery, setSearchQuery }: TeamHeaderProps) => {
  const { toast } = useToast();

  return (
    <SectionHeader 
      title="Gestão de Equipe" 
      description="Gerencie os membros da sua equipe"
      actions={
        <>
          <div className="relative md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar colaboradores..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ActionButton
            icon={<Download size={16} />}
            label="Exportar"
            onClick={() => {
              toast({
                title: "Exportação iniciada",
                description: "O arquivo será baixado em instantes",
              });
            }}
            variant="outline"
          />
          <ActionButton
            icon={<Plus size={16} />}
            label="Novo Colaborador"
            onClick={() => {
              toast({
                title: "Adicionar Colaborador",
                description: "Função de adicionar colaboradores será implementada em breve",
              });
            }}
          />
        </>
      }
    />
  );
};
