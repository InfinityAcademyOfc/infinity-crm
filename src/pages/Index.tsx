
import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GlassHeader from '@/components/landing/GlassHeader';
import AnimatedHero from '@/components/landing/AnimatedHero';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import VideoShowcase from '@/components/landing/VideoShowcase';
import TestimonialCarousel from '@/components/landing/TestimonialCarousel';
import GradientCTA from '@/components/landing/GradientCTA';
import FAQ from '@/components/landing/FAQ';
import PricingPlans from '@/components/landing/PricingPlans';
import { Skeleton } from '@/components/ui/skeleton';

// Create loading placeholders
const SectionSkeleton = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();

  // Se o usuário já está autenticado, redirecionar para o dashboard
  if (user && !loading) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Background grid pattern */}
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      {/* Global light effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <GlassHeader />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section id="hero">
          <Suspense fallback={<SectionSkeleton />}>
            <AnimatedHero />
          </Suspense>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 relative">
              <div className="inline-block">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                  Recursos
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                O Infinity CRM reúne as ferramentas essenciais para gerenciar seu negócio
                e melhorar o relacionamento com seus clientes.
              </p>
            </div>
            
            <Suspense fallback={<SectionSkeleton />}>
              <FeaturesGrid />
            </Suspense>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing">
          <Suspense fallback={<SectionSkeleton />}>
            <PricingPlans />
          </Suspense>
        </section>
        
        {/* Video Showcase Section */}
        <section id="videos" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-primary/5 to-black/40"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-block">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                  Demonstrações
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                Veja o Infinity CRM em ação
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Assista aos vídeos para conhecer as principais funcionalidades da plataforma.
              </p>
            </div>
            
            <Suspense fallback={<SectionSkeleton />}>
              <VideoShowcase />
            </Suspense>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-block">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                  Depoimentos
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                O que nossos clientes dizem
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Conheça as histórias de sucesso de empresas que transformaram seus resultados com o Infinity CRM.
              </p>
            </div>
            
            <Suspense fallback={<SectionSkeleton />}>
              <TestimonialCarousel />
            </Suspense>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-primary/5 to-black/40"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-block">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium backdrop-blur-sm border border-primary/20">
                  Perguntas Frequentes
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white">
                Tire suas dúvidas
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Encontre respostas para as perguntas mais comuns sobre o Infinity CRM.
              </p>
            </div>
            
            <Suspense fallback={<SectionSkeleton />}>
              <FAQ />
            </Suspense>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta">
          <Suspense fallback={<SectionSkeleton />}>
            <GradientCTA />
          </Suspense>
        </section>
      </main>
      
      <footer className="py-8 border-t border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Infinity CRM. Todos os direitos reservados.
            </p>
            
            <div className="flex gap-6">
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                Termos de Serviço
              </a>
              <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
