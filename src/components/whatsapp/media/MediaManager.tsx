
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Trash2, 
  Image, 
  FileAudio,
  FileText,
  Upload
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import UploadMediaDialog from "./UploadMediaDialog";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size_kb?: number;
  created_at: string;
  session_id?: string;
}

interface MediaManagerProps {
  sessionId: string;
}

const MediaManager = ({ sessionId }: MediaManagerProps) => {
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [mediaType, setMediaType] = useState<string>("all");
  
  // Fetch media from Supabase
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from("media")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false });
        
        if (mediaType !== "all") {
          query = query.eq("type", mediaType);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setMediaItems(data || []);
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
    
    fetchMediaItems();
  }, [toast, mediaType, sessionId]);
  
  const handleDeleteMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from("media")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setMediaItems(mediaItems.filter(item => item.id !== id));
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
  
  const handleMediaUploaded = (newMedia: MediaItem) => {
    setMediaItems([newMedia, ...mediaItems]);
    setUploadDialogOpen(false);
    toast({
      title: "Mídia carregada",
      description: "A nova mídia foi carregada com sucesso."
    });
  };

  // Filter media based on search term
  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
              <Upload size={16} className="mr-2" /> Carregar Mídia
            </Button>
          </div>
        </div>
        
        <Tabs value={mediaType} onValueChange={setMediaType} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="image">Imagens</TabsTrigger>
            <TabsTrigger value="audio">Áudios</TabsTrigger>
            <TabsTrigger value="document">Documentos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <p className="text-muted-foreground">Carregando mídias...</p>
          </div>
        ) : (
          filteredMedia.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhuma mídia encontrada" : "Nenhuma mídia cadastrada"}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload size={16} className="mr-2" /> Carregar mídia
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square relative bg-muted flex items-center justify-center">
                    {item.type === 'image' ? (
                      <img 
                        src={item.url} 
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : item.type === 'audio' ? (
                      <div className="flex flex-col items-center justify-center p-4">
                        <FileAudio size={64} className="text-primary mb-2" />
                        <audio src={item.url} controls className="w-full mt-2" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <FileText size={64} className="text-primary mb-2" />
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="truncate mr-2">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.size_kb ? `${item.size_kb} KB` : "Tamanho desconhecido"}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMedia(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge variant="outline" className={
                        item.type === 'image' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        item.type === 'audio' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }>
                        {item.type === 'image' && <Image size={12} className="mr-1" />}
                        {item.type === 'audio' && <FileAudio size={12} className="mr-1" />}
                        {item.type === 'document' && <FileText size={12} className="mr-1" />}
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        
        <UploadMediaDialog 
          open={uploadDialogOpen} 
          onOpenChange={setUploadDialogOpen}
          onMediaUploaded={handleMediaUploaded}
          sessionId={sessionId}
        />
      </CardContent>
    </Card>
  );
};

export default MediaManager;
