
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Play,
  ChevronLeft,
  ChevronRight,
  Image,
  Type,
  List,
  BarChart3,
  Presentation
} from 'lucide-react';
import { ProductionProject } from '@/hooks/useProductionWorkspace';

interface Slide {
  id: string;
  title: string;
  content: string;
  type: 'title' | 'content' | 'image' | 'chart' | 'list';
  order: number;
  notes?: string;
}

interface PresentationEditorProps {
  project: ProductionProject;
  onUpdate: (id: string, updates: Partial<ProductionProject>) => Promise<ProductionProject | null>;
}

const PresentationEditor: React.FC<PresentationEditorProps> = ({ project, onUpdate }) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNewSlideDialog, setShowNewSlideDialog] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    if (project.data?.slides) {
      setSlides(project.data.slides.sort((a: Slide, b: Slide) => a.order - b.order));
    } else {
      // Criar slide padrão
      const defaultSlide: Slide = {
        id: '1',
        title: 'Título da Apresentação',
        content: 'Bem-vindos à apresentação',
        type: 'title',
        order: 1
      };
      setSlides([defaultSlide]);
    }
  }, [project]);

  const saveSlides = async (newSlides: Slide[]) => {
    await onUpdate(project.id, {
      data: {
        ...project.data,
        slides: newSlides
      }
    });
  };

  const addSlide = (slideData: Omit<Slide, 'id' | 'order'>) => {
    const newSlide: Slide = {
      ...slideData,
      id: Date.now().toString(),
      order: slides.length + 1
    };

    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    saveSlides(updatedSlides);
    setCurrentSlide(updatedSlides.length - 1);
  };

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    const updatedSlides = slides.map(slide =>
      slide.id === slideId ? { ...slide, ...updates } : slide
    );

    setSlides(updatedSlides);
    saveSlides(updatedSlides);
  };

  const deleteSlide = (slideId: string) => {
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    // Reordenar
    updatedSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });

    setSlides(updatedSlides);
    saveSlides(updatedSlides);
    
    if (currentSlide >= updatedSlides.length) {
      setCurrentSlide(Math.max(0, updatedSlides.length - 1));
    }
  };

  const moveSlide = (from: number, to: number) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(from, 1);
    updatedSlides.splice(to, 0, movedSlide);
    
    // Reordenar
    updatedSlides.forEach((slide, index) => {
      slide.order = index + 1;
    });

    setSlides(updatedSlides);
    saveSlides(updatedSlides);
    setCurrentSlide(to);
  };

  const getSlideIcon = (type: string) => {
    switch (type) {
      case 'title': return <Type className="h-4 w-4" />;
      case 'content': return <Type className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'chart': return <BarChart3 className="h-4 w-4" />;
      case 'list': return <List className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const getSlideTypeLabel = (type: string) => {
    switch (type) {
      case 'title': return 'Título';
      case 'content': return 'Conteúdo';
      case 'image': return 'Imagem';
      case 'chart': return 'Gráfico';
      case 'list': return 'Lista';
      default: return type;
    }
  };

  const renderSlidePreview = (slide: Slide) => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white flex flex-col justify-center items-center">
            <h1 className="text-lg font-bold text-center mb-2">{slide.title}</h1>
            <p className="text-sm opacity-90 text-center">{slide.content}</p>
          </div>
        );
      case 'content':
        return (
          <div className="h-32 bg-white border rounded-lg p-4">
            <h2 className="text-md font-semibold mb-2">{slide.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3">{slide.content}</p>
          </div>
        );
      case 'list':
        return (
          <div className="h-32 bg-white border rounded-lg p-4">
            <h2 className="text-md font-semibold mb-2">{slide.title}</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              {slide.content.split('\n').slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return (
          <div className="h-32 bg-gray-100 border rounded-lg p-4 flex items-center justify-center">
            {getSlideIcon(slide.type)}
            <span className="ml-2 text-sm text-gray-600">{getSlideTypeLabel(slide.type)}</span>
          </div>
        );
    }
  };

  if (presentationMode) {
    const slide = slides[currentSlide];
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="w-full max-w-4xl h-full bg-white rounded-lg shadow-2xl p-8 flex flex-col justify-center">
            {slide?.type === 'title' ? (
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-8 text-gray-800">{slide.title}</h1>
                <p className="text-2xl text-gray-600">{slide.content}</p>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold mb-8 text-gray-800">{slide?.title}</h1>
                <div className="text-xl text-gray-700 whitespace-pre-wrap">{slide?.content}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/80 rounded-lg p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-white text-sm">
            {currentSlide + 1} / {slides.length}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPresentationMode(false)}
            className="ml-4"
          >
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
        <Button
          onClick={() => setShowNewSlideDialog(true)}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Slide
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPresentationMode(true)}
          disabled={slides.length === 0}
        >
          <Play className="h-4 w-4 mr-2" />
          Apresentar
        </Button>
        
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Presentation className="h-3 w-3 mr-1" />
            {slides.length} slides
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Slide Thumbnails */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Slides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`cursor-pointer border rounded-lg p-2 transition-colors ${
                    currentSlide === index ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    Slide {index + 1}
                  </div>
                  {renderSlidePreview(slide)}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium truncate">{slide.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSlide(slide);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {slides.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Nenhum slide criado</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNewSlideDialog(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Primeiro Slide
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Slide Editor */}
        <div className="lg:col-span-3">
          {slides[currentSlide] ? (
            <SlideEditor
              slide={slides[currentSlide]}
              onUpdate={(updates) => updateSlide(slides[currentSlide].id, updates)}
              onDelete={() => deleteSlide(slides[currentSlide].id)}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Presentation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Selecione um slide para editar</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* New Slide Dialog */}
      <NewSlideDialog
        open={showNewSlideDialog}
        onOpenChange={setShowNewSlideDialog}
        onSubmit={(slide) => {
          addSlide(slide);
          setShowNewSlideDialog(false);
        }}
      />

      {/* Edit Slide Dialog */}
      {editingSlide && (
        <EditSlideDialog
          slide={editingSlide}
          onSave={(updates) => {
            updateSlide(editingSlide.id, updates);
            setEditingSlide(null);
          }}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
};

// Slide Editor Component
const SlideEditor: React.FC<{
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
  onDelete: () => void;
}> = ({ slide, onUpdate, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {slide.type === 'title' && <Type className="h-5 w-5" />}
            {slide.type === 'content' && <Type className="h-5 w-5" />}
            {slide.type === 'image' && <Image className="h-5 w-5" />}
            {slide.type === 'chart' && <BarChart3 className="h-5 w-5" />}
            {slide.type === 'list' && <List className="h-5 w-5" />}
            Editando Slide
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Título</label>
          <Input
            value={slide.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Título do slide"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-2">Conteúdo</label>
          <Textarea
            value={slide.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Conteúdo do slide"
            rows={8}
          />
        </div>
        
        {slide.notes !== undefined && (
          <div>
            <label className="text-sm font-medium block mb-2">Notas do Apresentador</label>
            <Textarea
              value={slide.notes || ''}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Notas para o apresentador"
              rows={3}
            />
          </div>
        )}
        
        <div className="border rounded-lg p-4 bg-muted/50">
          <label className="text-sm font-medium block mb-2">Visualização</label>
          <div className="bg-white rounded border" style={{ aspectRatio: '16/9' }}>
            {slide.type === 'title' ? (
              <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white flex flex-col justify-center items-center p-8">
                <h1 className="text-3xl font-bold text-center mb-4">{slide.title}</h1>
                <p className="text-lg opacity-90 text-center">{slide.content}</p>
              </div>
            ) : (
              <div className="h-full p-8 flex flex-col">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">{slide.title}</h1>
                <div className="text-lg text-gray-700 whitespace-pre-wrap flex-1">{slide.content}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// New Slide Dialog Component
const NewSlideDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (slide: Omit<Slide, 'id' | 'order'>) => void;
}> = ({ open, onOpenChange, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'title' | 'content' | 'image' | 'chart' | 'list'>('content');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      title,
      content,
      type,
      notes: ''
    });

    // Reset form
    setTitle('');
    setContent('');
    setType('content');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Slide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tipo de Slide</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="title">Slide de Título</option>
              <option value="content">Conteúdo</option>
              <option value="list">Lista</option>
              <option value="image">Imagem</option>
              <option value="chart">Gráfico</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do slide"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Conteúdo</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conteúdo do slide"
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Criar Slide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Edit Slide Dialog Component
const EditSlideDialog: React.FC<{
  slide: Slide;
  onSave: (updates: Partial<Slide>) => void;
  onClose: () => void;
}> = ({ slide, onSave, onClose }) => {
  const [title, setTitle] = useState(slide.title);
  const [content, setContent] = useState(slide.content);
  const [type, setType] = useState(slide.type);
  const [notes, setNotes] = useState(slide.notes || '');

  const handleSave = () => {
    onSave({
      title,
      content,
      type,
      notes
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Slide</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tipo de Slide</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="title">Slide de Título</option>
              <option value="content">Conteúdo</option>
              <option value="list">Lista</option>
              <option value="image">Imagem</option>
              <option value="chart">Gráfico</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Título *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do slide"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Conteúdo</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conteúdo do slide"
              rows={4}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Notas do Apresentador</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas para o apresentador"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PresentationEditor;
