
import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "O Infinity CRM transformou completamente a maneira como gerenciamos nossos clientes. Aumentamos nossas vendas em 40% no primeiro mês!",
    author: "Carlos Silva",
    role: "CEO, TechSolutions"
  },
  {
    quote: "A organização de leads nunca foi tão simples. Conseguimos acompanhar toda jornada do cliente e aumentar nossa taxa de conversão.",
    author: "Mariana Santos",
    role: "Gerente de Vendas, InnovateX"
  },
  {
    quote: "A integração com WhatsApp revolucionou nosso atendimento. Agora respondemos clientes em tempo real sem sair do sistema.",
    author: "Rafael Mendes",
    role: "Diretor Comercial, GrowthHub"
  },
  {
    quote: "Relatórios detalhados que realmente fazem diferença. Finalmente consigo tomar decisões baseadas em dados reais do meu negócio.",
    author: "Juliana Costa",
    role: "Analista de Marketing, FutureMedia"
  },
  {
    quote: "Interface intuitiva e fácil de usar. Minha equipe se adaptou rapidamente e agora todos trabalham de forma muito mais produtiva.",
    author: "Pedro Almeida",
    role: "Gerente de Operações, NextLevel"
  },
  {
    quote: "Aumentamos nossa produtividade em 60% desde que começamos a usar o Infinity CRM. A automação de tarefas repetitivas é excelente!",
    author: "Fernanda Oliveira",
    role: "Diretora de Operações, SmartTech"
  },
  {
    quote: "O suporte ao cliente é impecável. Sempre que tenho uma dúvida, recebo ajuda imediata e soluções personalizadas para o meu negócio.",
    author: "Roberto Gomes",
    role: "Empresário, RG Empreendimentos"
  }
];

export default function TestimonialCarousel() {
  return (
    <Carousel 
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-2">
            <div className="h-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500"></div>
              <Quote className="text-primary/70 mb-4 h-8 w-8" />
              <p className="text-white/90 italic mb-4 flex-grow">{testimonial.quote}</p>
              <div>
                <h4 className="font-bold text-white">{testimonial.author}</h4>
                <p className="text-white/60 text-sm">{testimonial.role}</p>
              </div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-8 gap-2">
        <CarouselPrevious className="relative static left-0 right-auto translate-y-0 bg-black/40 border-white/10 hover:bg-primary/20 text-white" />
        <CarouselNext className="relative static right-0 left-auto translate-y-0 bg-black/40 border-white/10 hover:bg-primary/20 text-white" />
      </div>
    </Carousel>
  );
}
