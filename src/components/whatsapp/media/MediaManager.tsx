
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Search, 
  Upload,
  Image,
  FileText,
  FileAudio,
  Video,
  Trash2,
  Copy,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import UploadMediaDialog from "./UploadMediaDialog";
import { supabase } from "@/lib/supabase";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size_kb?: number;
  created_at: string;
}

const MediaManager = () => {
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Fetch media from Supabase
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("media")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setMedia(data || []);
      } catch (error) {
        console.error("Error fetching media:", error);
        toast({
          title: "Erro ao carregar mídias",
          description: "Não foi possível carregar as mídias. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, [toast]);
  
  const handleDeleteMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from("media")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setMedia(media.filter(item => item.id !== id));
      toast({
        title: "Mídia excluída",
        description: "A mídia foi excluída com sucesso."
      });
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({
        title: "Erro ao excluir mídia",
        description: "Não foi possível excluir a mídia. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada",
      description: "A URL da mídia foi copiada para a área de transferência."
    });
  };
  
  const handleMediaUploaded = (newMedia: MediaItem) => {
    setMedia([newMedia, ...media]);
    setUploadOpen(false);
    toast({
      title: "Mídia enviada",
      description: "A mídia foi enviada com sucesso."
    });
  };
  
  // Get media type icon
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={16} />;
      case 'audio':
        return <FileAudio size={16} />;
      case 'video':
        return <Video size={16} />;
      default:
        return <FileText size={16} />;
    }
  };
  
  // Filter media based on search term and selected type
  const filteredMedia = media.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar mídias..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedType(null)} className={!selectedType ? "bg-secondary" : ""}>
              Todas
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedType('image')} className={selectedType === 'image' ? "bg-secondary" : ""}>
              <Image size={14} className="mr-1" /> Imagens
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedType('audio')} className={selectedType === 'audio' ? "bg-secondary" : ""}>
              <FileAudio size={14} className="mr-1" /> Áudios
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedType('document')} className={selectedType === 'document' ? "bg-secondary" : ""}>
              <FileText size={14} className="mr-1" /> Documentos
            </Button>
            <Button size="sm" onClick={() => setUploadOpen(true)}>
              <Upload size={14} className="mr-2" /> Enviar
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando mídias...</p>
          </div>
        ) : (
          <>
            {filteredMedia.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <FileText size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">Nenhuma mídia encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedType 
                    ? "Tente ajustar seus filtros de busca" 
                    : "Envie sua primeira mídia para começar"}
                </p>
                <Button onClick={() => setUploadOpen(true)}>
                  <Upload size={16} className="mr-2" /> Enviar Mídia
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div key={item.id} className="border rounded-md overflow-hidden bg-background">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleCopyUrl(item.url)}
                        >
                          <Copy size={14} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleDeleteMedia(item.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      
                      {item.type === 'image' ? (
                        <AspectRatio ratio={1}>
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                          />
                        </AspectRatio>
                      ) : (
                        <AspectRatio ratio={1}>
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            {getMediaTypeIcon(item.type)}
                          </div>
                        </AspectRatio>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="mb-1 flex items-center gap-1 text-xs">
                          {getMediaTypeIcon(item.type)}
                          {item.type}
                        </Badge>
                        {item.size_kb && (
                          <span className="text-xs text-muted-foreground">
                            {(item.size_kb / 1024).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        <UploadMediaDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onMediaUploaded={handleMediaUploaded}
        />
      </CardContent>
    </Card>
  );
};

export default MediaManager;
