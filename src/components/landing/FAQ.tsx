
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "O que é o Infinity CRM?",
    answer: "O Infinity CRM é uma plataforma completa de gestão de relacionamento com clientes, desenvolvida para ajudar empresas a organizarem suas vendas, leads e atendimento em um único lugar."
  },
  {
    question: "Como o Infinity CRM pode ajudar meu negócio?",
    answer: "Nosso sistema ajuda a centralizar informações de clientes, automatizar processos de vendas, gerenciar funis de conversão, integrar canais de comunicação como WhatsApp e melhorar a produtividade da sua equipe."
  },
  {
    question: "Preciso instalar algum software?",
    answer: "Não! O Infinity CRM é 100% baseado em nuvem. Você pode acessar de qualquer dispositivo conectado à internet, sem necessidade de instalação."
  },
  {
    question: "Posso integrar com outras ferramentas que já uso?",
    answer: "Sim, oferecemos integrações com diversas plataformas como WhatsApp, ferramentas de marketing digital, sistemas de pagamento e muito mais."
  },
  {
    question: "Quanto tempo leva para implementar o sistema?",
    answer: "A implementação básica é imediata! Você pode começar a usar em minutos após o cadastro. Para configurações mais avançadas e importação de dados, nossa equipe oferece suporte dedicado."
  },
  {
    question: "Existe um limite de usuários?",
    answer: "Temos planos flexíveis para diferentes tamanhos de equipe. Desde pequenas empresas até grandes corporações, nossos planos se adaptam às suas necessidades."
  },
  {
    question: "O sistema funciona bem em celulares?",
    answer: "Absolutamente! O Infinity CRM é 100% responsivo e foi desenvolvido pensando na mobilidade. Você pode acessar todas as funcionalidades do seu smartphone ou tablet."
  },
  {
    question: "Como funciona o suporte técnico?",
    answer: "Oferecemos suporte por chat, email e telefone em horário comercial. Nossos planos premium incluem suporte prioritário e atendimento personalizado."
  },
  {
    question: "Posso testar antes de assinar?",
    answer: "Sim, oferecemos um período de teste gratuito de 14 dias com acesso a todas as funcionalidades, sem necessidade de cartão de crédito."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "A segurança é nossa prioridade. Utilizamos criptografia de ponta a ponta, servidores com certificação de segurança e fazemos backups diários de todos os dados."
  }
];

export default function FAQ() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10">
            <AccordionTrigger className="text-lg text-white hover:text-primary transition-colors py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-white/80">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
