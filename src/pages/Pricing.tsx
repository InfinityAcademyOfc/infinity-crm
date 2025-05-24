
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/theme/ThemeToggle';

const Pricing = () => {
  const plans = [
    {
      name: "Básico",
      price: "R$ 97",
      period: "/mês",
      description: "Ideal para pequenas empresas",
      features: [
        "Até 1.000 contatos",
        "5 usuários",
        "Relatórios básicos",
        "Suporte por email",
        "Integração WhatsApp",
        "Funil de vendas"
      ],
      highlighted: false
    },
    {
      name: "Profissional",
      price: "R$ 197",
      period: "/mês",
      description: "Para empresas em crescimento",
      features: [
        "Até 10.000 contatos",
        "20 usuários",
        "Relatórios avançados",
        "Suporte prioritário",
        "Todas as integrações",
        "Automações avançadas",
        "API personalizada"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "R$ 397",
      period: "/mês",
      description: "Para grandes organizações",
      features: [
        "Contatos ilimitados",
        "Usuários ilimitados",
        "Relatórios personalizados",
        "Suporte 24/7",
        "Integrações customizadas",
        "Gerente de conta dedicado",
        "Treinamento personalizado"
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="container relative z-10 px-4 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container relative z-10 px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Encontre o plano perfeito para acelerar o crescimento do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-black/40 border-white/10 backdrop-blur-lg ${
                plan.highlighted ? 'ring-2 ring-primary shadow-[0_0_25px_rgba(130,80,223,0.3)]' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-white/70">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/80">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link to={`/register?plan=${plan.name.toLowerCase()}`}>
                  <Button 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-white/10 hover:bg-white/20 border-white/20'
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    Começar Agora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-white/60 mb-4">
            Não tem certeza qual plano escolher?
          </p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
            Falar com Vendas
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
