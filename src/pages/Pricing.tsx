
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/theme/ThemeToggle';

const PricingTier = ({ 
  name, 
  price, 
  description, 
  features, 
  isPopular = false,
  ctaText = "Começar agora"
}) => {
  return (
    <Card className={`flex flex-col h-full ${isPopular ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/10'}`}>
      {isPopular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-xs font-medium">
          MAIS POPULAR
        </div>
      )}
      <CardHeader className={`${isPopular ? 'pb-4' : 'pb-8'}`}>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">R${price}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary shrink-0 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button className={`w-full ${isPopular ? 'bg-primary hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}>
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Plano Básico",
      price: "49",
      description: "Para profissionais autônomos e pequenos negócios.",
      features: [
        "1 usuário",
        "50 contatos",
        "1 número WhatsApp",
        "Atendimento por email",
        "Funil de vendas básico",
        "Dashboard simplificado"
      ]
    },
    {
      name: "Plano Profissional",
      price: "99",
      description: "Para empresas em crescimento que precisam de mais recursos.",
      features: [
        "5 usuários",
        "500 contatos",
        "3 números WhatsApp",
        "Atendimento prioritário",
        "Funil de vendas completo",
        "Automações básicas",
        "Integração com email marketing"
      ],
      isPopular: true
    },
    {
      name: "Plano Empresarial",
      price: "299",
      description: "Para empresas estabelecidas que precisam de recursos avançados.",
      features: [
        "Usuários ilimitados",
        "Contatos ilimitados",
        "10 números WhatsApp",
        "Atendimento VIP",
        "API completa",
        "Automações avançadas",
        "Personalização completa",
        "Integrações customizadas"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="container relative z-10 px-4 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container relative z-10 py-12 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Planos e preços simples</h1>
          <p className="text-xl text-white/70">
            Escolha o plano que melhor se adapta às necessidades do seu negócio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <PricingTier key={i} {...tier} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Precisa de um plano personalizado?</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Empresas com necessidades específicas podem entrar em contato para um plano sob medida
            com funcionalidades e preços personalizados.
          </p>
          <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5">
            Fale com nossa equipe
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
