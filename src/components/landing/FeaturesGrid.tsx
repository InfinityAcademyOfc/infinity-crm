
import React from 'react';
import { LineChart, Users, BarChart, Calendar, MessageCircle, Settings } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: 'Gestão de Leads e Vendas',
    description: 'Acompanhe seu funil de vendas e gerencie leads de forma eficiente.',
    icon: <LineChart className="h-10 w-10 text-primary" />
  },
  {
    title: 'Gestão de Clientes',
    description: 'Mantenha informações detalhadas e histórico de interações com clientes.',
    icon: <Users className="h-10 w-10 text-primary" />
  },
  {
    title: 'Relatórios e Análises',
    description: 'Visualize dados importantes para tomar decisões estratégicas.',
    icon: <BarChart className="h-10 w-10 text-primary" />
  },
  {
    title: 'Gestão de Reuniões',
    description: 'Agende e gerencie reuniões com clientes e equipe.',
    icon: <Calendar className="h-10 w-10 text-primary" />
  },
  {
    title: 'Integrações',
    description: 'Conecte com WhatsApp, ferramentas de marketing, e muito mais.',
    icon: <MessageCircle className="h-10 w-10 text-primary" />
  },
  {
    title: 'Personalização',
    description: 'Adapte o sistema às necessidades específicas do seu negócio.',
    icon: <Settings className="h-10 w-10 text-primary" />
  },
];

export default function FeaturesGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card relative overflow-hidden p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 group"
          >
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-70 group-hover:bg-primary/15 group-hover:opacity-100 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-black/60 border border-white/10 mb-4 group-hover:border-primary/30 group-hover:bg-black/80 transition-all duration-300 shadow-[0_0_15px_rgba(130,80,223,0.2)] group-hover:shadow-[0_0_25px_rgba(130,80,223,0.4)]">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
              
              <p className="text-white/70">{feature.description}</p>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
