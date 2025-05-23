
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const WelcomeCard = () => {
  const { user, profile, company, isCompany } = useAuth();
  
  const getUserName = () => {
    if (isCompany && company?.name) {
      return company.name;
    }
    if (profile?.name) {
      return profile.name.split(' ')[0]; // Primeiro nome
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Usuário";
  };

  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {getUserName()}! 👋
          </h1>
          <p className="text-muted-foreground capitalize">
            {currentDate}
          </p>
          <p className="text-sm text-muted-foreground">
            Bem-vindo ao seu painel de controle. Aqui você pode acompanhar todas as atividades do seu negócio.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
