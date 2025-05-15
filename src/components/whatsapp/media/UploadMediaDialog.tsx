
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileAudio, FileText, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size_kb?: number;
  created_at: string;
}

interface UploadMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMediaUploaded: (media: MediaItem) => void;
  sessionId: string;
}

const UploadMediaDialog = ({ 
  open, 
  onOpenChange, 
  onMediaUploaded,
  sessionId
}: UploadMediaDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<string>("image");
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };
  
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      
      let url, name, type, size_kb;
      
      if (uploadMethod === "file" && selectedFile) {
        // Implement file upload to storage service (e.g., Supabase Storage)
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${sessionId}/${Date.now()}.${fileExt}`;
        
        // For this example, let's assume we're using Supabase Storage
        const { data, error } = await supabase
          .storage
          .from('media')
          .upload(filePath, selectedFile);
          
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('media')
          .getPublicUrl(data.path);
          
        url = urlData.publicUrl;
        name = fileName;
        type = mediaType;
        size_kb = Math.round(selectedFile.size / 1024);
      } else if (uploadMethod === "url" && mediaUrl) {
        // Using external URL
        url = mediaUrl;
        name = fileName || "External media";
        type = mediaType;
      } else {
        throw new Error("No file or URL provided");
      }
      
      // Save media info to database
      const { data, error } = await supabase
        .from("media")
        .insert({
          name,
          url,
          type,
          size_kb,
          session_id: sessionId // Associate media with session
        })
        .select()
        .single();
        
      if (error) throw error;
      
      onMediaUploaded(data as MediaItem);
      resetForm();
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Erro ao carregar mídia",
        description: "Não foi possível carregar a mídia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setMediaUrl("");
    setFileName("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Carregar Nova Mídia</DialogTitle>
        </DialogHeader>
        
        <Tabs value={mediaType} onValueChange={setMediaType} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="image" className="flex items-center gap-1">
              <Image size={16} /> Imagem
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <FileAudio size={16} /> Áudio
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-1">
              <FileText size={16} /> Documento
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Tabs value={uploadMethod} onValueChange={setUploadMethod as any}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="file">Carregar arquivo</TabsTrigger>
            <TabsTrigger value="url">URL externa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={
                    mediaType === 'image' ? 'image/*' :
                    mediaType === 'audio' ? 'audio/*' :
                    '.pdf,.doc,.docx,.txt,.xls,.xlsx'
                  }
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fileName">Nome do arquivo</Label>
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Nome para exibição"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="url">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="urlFileName">Nome do arquivo</Label>
                <Input
                  id="urlFileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Nome para exibição"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || 
              (uploadMethod === "file" && !selectedFile) || 
              (uploadMethod === "url" && !mediaUrl)}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" /> 
                Carregando...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" /> 
                Carregar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMediaDialog;
