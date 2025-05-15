
import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoItem {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
}

const videos: VideoItem[] = [
  {
    title: "Gestão de Leads Simplificada",
    description: "Veja como organizar seus leads e aumentar conversões com nosso sistema intuitivo.",
    thumbnail: "https://images.unsplash.com/photo-1593642702909-dec73df255d7?q=80&w=1169&auto=format&fit=crop",
    videoUrl: "#video-demo-1"
  },
  {
    title: "Automação de Processos",
    description: "Automatize tarefas repetitivas e foque no que realmente importa para seu negócio.",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1170&auto=format&fit=crop",
    videoUrl: "#video-demo-2"
  },
  {
    title: "Integração com WhatsApp",
    description: "Comunique-se com clientes sem sair da plataforma usando nossa integração nativa.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1170&auto=format&fit=crop",
    videoUrl: "#video-demo-3"
  }
];

export default function VideoShowcase() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {videos.map((video, index) => (
          <div 
            key={index} 
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-16 h-16 rounded-full bg-black/30 border border-white/20 backdrop-blur-sm text-white hover:bg-primary/30 hover:border-primary/50 hover:scale-110 transition-all duration-300"
                >
                  <PlayCircle className="w-8 h-8" />
                </Button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">{video.title}</h3>
              <p className="text-white/70">{video.description}</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
