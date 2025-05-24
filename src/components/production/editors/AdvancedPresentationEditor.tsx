
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus,
  Play,
  Image,
  Type,
  Palette,
  Layout,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Slide {
  id: string;
  title: string;
  content: string;
  layout: 'title' | 'content' | 'two-column' | 'image';
  backgroundColor?: string;
}

interface AdvancedPresentationEditorProps {
  data: any;
  onChange: (data: any) => void;
  projectId: string;
}

export default function AdvancedPresentationEditor({ 
  data, 
  onChange, 
  projectId 
}: AdvancedPresentationEditorProps) {
  const [slides, setSlides] = useState<Slide[]>(data.slides || [
    {
      id: '1',
      title: 'Slide 1',
      content: 'Conteúdo do primeiro slide',
      layout: 'title'
    }
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [theme, setTheme] = useState(data.theme || 'default');

  useEffect(() => {
    onChange({ 
      ...data, 
      slides,
      theme,
      version: (data.version || 1) + 1 
    });
  }, [slides, theme]);

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      content: 'Novo conteúdo',
      layout: 'content'
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      setActiveSlideIndex(Math.min(activeSlideIndex, newSlides.length - 1));
    }
  };

  const handleDuplicateSlide = (index: number) => {
    const slideToClone = slides[index];
    const newSlide: Slide = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
      title: `${slideToClone.title} (Cópia)`
    };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideIndex(index + 1);
  };

  const handleSlideChange = (field: keyof Slide, value: string) => {
    const newSlides = slides.map((slide, index) => 
      index === activeSlideIndex 
        ? { ...slide, [field]: value }
        : slide
    );
    setSlides(newSlides);
  };

  const activeSlide = slides[activeSlideIndex];

  const layouts = [
    { id: 'title', name: 'Título', icon: Type },
    { id: 'content', name: 'Conteúdo', icon: Layout },
    { id: 'two-column', name: 'Duas Colunas', icon: Layout },
    { id: 'image', name: 'Imagem', icon: Image }
  ];

  const themes = [
    { id: 'default', name: 'Padrão', color: '#ffffff' },
    { id: 'dark', name: 'Escuro', color: '#1f2937' },
    { id: 'blue', name: 'Azul', color: '#3b82f6' },
    { id: 'green', name: 'Verde', color: '#10b981' }
  ];

  return (
    <div className="h-full flex">
      {/* Slides Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Slides</h3>
            <Button size="sm" onClick={handleAddSlide}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Play className="h-4 w-4 mr-1" />
            Apresentar
          </Button>
        </div>

        <div className="flex-1 p-2 space-y-2 overflow-y-auto">
          {slides.map((slide, index) => (
            <Card 
              key={slide.id}
              className={`cursor-pointer transition-colors ${
                index === activeSlideIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveSlideIndex(index)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{slide.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {slide.content}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateSlide(index);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(index);
                    }}
                    disabled={slides.length <= 1}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                disabled={activeSlideIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {activeSlideIndex + 1} de {slides.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
                disabled={activeSlideIndex === slides.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            {layouts.map((layout) => {
              const IconComponent = layout.icon;
              return (
                <Button
                  key={layout.id}
                  variant={activeSlide?.layout === layout.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSlideChange('layout', layout.id)}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  {layout.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Slide Canvas */}
        <div className="flex-1 p-8 bg-gray-50">
          <Card className="w-full max-w-4xl mx-auto aspect-video">
            <CardContent className="p-8 h-full">
              <div className="h-full flex flex-col">
                <input
                  type="text"
                  value={activeSlide?.title || ''}
                  onChange={(e) => handleSlideChange('title', e.target.value)}
                  className="text-2xl font-bold mb-4 bg-transparent border-none outline-none"
                  placeholder="Título do slide"
                />
                <textarea
                  value={activeSlide?.content || ''}
                  onChange={(e) => handleSlideChange('content', e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none resize-none"
                  placeholder="Conteúdo do slide..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 border-l p-4">
        <h3 className="font-medium mb-4">Propriedades</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Layout</label>
            <div className="grid grid-cols-2 gap-2">
              {layouts.map((layout) => {
                const IconComponent = layout.icon;
                return (
                  <Button
                    key={layout.id}
                    variant={activeSlide?.layout === layout.id ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => handleSlideChange('layout', layout.id)}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {layout.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tema</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <Button
                  key={t.id}
                  variant={theme === t.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(t.id)}
                  className="justify-start"
                >
                  <div 
                    className="w-3 h-3 rounded mr-2" 
                    style={{ backgroundColor: t.color }}
                  />
                  {t.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Estatísticas</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Total de slides: {slides.length}</div>
              <div>Slide atual: {activeSlideIndex + 1}</div>
              <div>Tema: {themes.find(t => t.id === theme)?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
