
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PlansSettings = () => {
  const { user, company } = useAuth();

  const currentPlan = {
    name: "Plano Profissional",
    price: "R$ 97,00",
    period: "mensal",
    status: "ativo",
    nextBilling: "15/01/2025",
    features: [
      "CRM completo",
      "Gestão de leads ilimitados",
      "Dashboard avançado",
      "Relatórios personalizados",
      "Suporte prioritário",
      "Integração WhatsApp",
      "Automação de vendas"
    ]
  };

  const availablePlans = [
    {
      id: "basic",
      name: "Básico",
      price: "R$ 47,00",
      period: "mensal",
      description: "Ideal para pequenos negócios",
      features: [
        "CRM básico",
        "Até 100 leads",
        "Dashboard simples",
        "Suporte via email"
      ],
      current: false
    },
    {
      id: "professional",
      name: "Profissional",
      price: "R$ 97,00",
      period: "mensal",
      description: "Para empresas em crescimento",
      features: [
        "CRM completo",
        "Leads ilimitados",
        "Dashboard avançado",
        "Relatórios personalizados",
        "Suporte prioritário",
        "Integração WhatsApp"
      ],
      current: true,
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R$ 197,00",
      period: "mensal",
      description: "Para grandes empresas",
      features: [
        "Todos os recursos do Profissional",
        "API personalizada",
        "Suporte dedicado",
        "Onboarding personalizado",
        "SLA garantido"
      ],
      current: false
    }
  ];

  if (!user || !company) {
    return (
      <div className="p-6 text-center animate-fade-in">
        <p className="text-muted-foreground">Faça login para visualizar os planos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold">Planos e Assinatura</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie sua assinatura e explore nossos planos
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-primary/20 animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentPlan.name}
                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {currentPlan.status}
                </Badge>
              </CardTitle>
              <CardDescription>
                Próxima cobrança: {currentPlan.nextBilling}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentPlan.price}</div>
              <div className="text-sm text-muted-foreground">/{currentPlan.period}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <h4 className="font-medium mb-2">Recursos inclusos:</h4>
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="outline" className="hover-scale transition-all duration-200">
              Gerenciar Assinatura
            </Button>
            <Button variant="outline" className="hover-scale transition-all duration-200">
              Histórico de Pagamentos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Planos Disponíveis</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {availablePlans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 hover:shadow-lg animate-scale-in ${
                plan.current ? 'border-primary/40 shadow-md' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <Star className="h-3 w-3" />
                    Mais Popular
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {plan.current && (
                    <Badge variant="outline" className="text-xs">
                      Atual
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, featIndex) => (
                    <div key={featIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full hover-scale transition-all duration-200" 
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                >
                  {plan.current ? "Plano Atual" : "Escolher Plano"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansSettings;
