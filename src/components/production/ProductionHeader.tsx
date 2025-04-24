
import React from "react";
import { Plus, Download, BarChart } from "lucide-react";
import { SectionHeader, ActionButton } from "@/components/ui/section-header";
import { useToast } from "@/hooks/use-toast";

const ProductionHeader = () => {
  const { toast } = useToast();

  return (
    <SectionHeader 
      title="Gestão de Produção" 
      description="Acompanhe e organize as tarefas de produção"
      actions={
        <>
          <ActionButton
            icon={<BarChart size={16} />}
            label="Relatórios"
            onClick={() => {
              toast({
                title: "Relatórios",
                description: "Função de relatórios será implementada em breve",
              });
            }}
            variant="outline"
          />
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
            label="Nova Tarefa"
            onClick={() => {
              toast({
                title: "Nova Tarefa",
                description: "Função de adicionar tarefas será implementada em breve",
              });
            }}
          />
        </>
      }
    />
  );
};

export default ProductionHeader;
