
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, TrendingUp, Users, DollarSign } from "lucide-react";

const WelcomeCard = () => {
  const { profile, company, isCompanyAccount } = useAuth();
  
  const userName = isCompanyAccount ? company?.name : profile?.name;
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return "Bom dia";
    if (currentHour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {getGreeting()}, {userName || 'Usuário'}! 👋
            </CardTitle>
            <p className="text-blue-100 capitalize mt-1">
              {today}
            </p>
          </div>
          <Calendar className="h-8 w-8 text-blue-200" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-blue-100 mb-4">
          Aqui está um resumo do que está acontecendo no seu {isCompanyAccount ? 'negócio' : 'trabalho'} hoje.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
            <TrendingUp className="h-5 w-5 text-green-300" />
            <div>
              <div className="text-sm text-blue-100">Vendas</div>
              <div className="font-semibold">Em crescimento</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
            <Users className="h-5 w-5 text-blue-300" />
            <div>
              <div className="text-sm text-blue-100">Equipe</div>
              <div className="font-semibold">Ativa</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
            <DollarSign className="h-5 w-5 text-yellow-300" />
            <div>
              <div className="text-sm text-blue-100">Financeiro</div>
              <div className="font-semibold">Estável</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
