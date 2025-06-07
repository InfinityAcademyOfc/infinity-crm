
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const WelcomeCard = () => {
  // Usar diretamente o contexto de autenticação para obter informações do usuário
  const { profile, company } = useAuth();
  
  // Formatar nome para saudação - priorizar nome da empresa, depois nome do perfil
  const displayName = company?.name || profile?.name || "visitante";
  const formattedName = displayName.split(' ')[0]; // Pegar apenas o primeiro nome
  
  return (
    <Card className="bg-gradient-to-r from-primary/20 to-blue-600/20 border-none shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center mx-0 px-0">
        <div className="animate-slide-in">
          <h2 className="text-2xl font-semibold mb-2 px-[10px]">
            Olá {formattedName}, bem vindo!
          </h2>
          <p className="text-muted-foreground max-w-xl px-[10px]">
            Com a Infinity CRM você gerencia todos seus trabalhos com praticidade de forma inteligente!
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex px-4">
          <Button variant="default" className="flex items-center gap-2">
            Explorar recursos
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
