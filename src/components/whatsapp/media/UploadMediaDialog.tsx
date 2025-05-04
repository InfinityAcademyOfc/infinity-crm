
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
}

const UploadMediaDialog = ({ 
  open, 
  onOpenChange, 
  onMediaUploaded 
}: UploadMediaDialogProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<string>("image");
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    
    // Determine media type from file
    if (file.type.startsWith('image/')) {
      setMediaType('image');
    } else if (file.type.startsWith('audio/')) {
      setMediaType('audio');
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
    } else {
      setMediaType('document');
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    try {
      setIsUploading(true);
      
      if (uploadMethod === "file" && selectedFile) {
        // File upload implementation would go here
        // For now, simulate upload success
        const fileSize = selectedFile.size / 1024; // Convert to KB
        const timestamp = Date.now();
        const fileUrl = URL.createObjectURL(selectedFile);
        
        // Insert record into media table
        const { data, error } = await supabase
          .from("media")
          .insert({
            name: fileName || selectedFile.name,
            url: fileUrl, // In a real implementation, this would be a storage URL
            type: mediaType,
            size_kb: fileSize
          })
          .select();
          
        if (error) throw error;
        
        onMediaUploaded(data[0]);
      } else if (uploadMethod === "url" && mediaUrl) {
        // URL-based media insertion
        const { data, error } = await supabase
          .from("media")
          .insert({
            name: fileName || "Media from URL",
            url: mediaUrl,
            type: mediaType
          })
          .select();
          
        if (error) throw error;
        
        onMediaUploaded(data[0]);
      } else {
        toast({
          title: "Erro no envio",
          description: "Selecione um arquivo ou forneça uma URL válida.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar a mídia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    if (value === "image") setMediaType("image");
    if (value === "audio") setMediaType("audio");
    if (value === "document") setMediaType("document");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Mídia</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant={uploadMethod === "file" ? "default" : "outline"} 
              onClick={() => setUploadMethod("file")}
              size="sm"
              className="flex-1"
            >
              <Upload size={16} className="mr-2" />
              Arquivo
            </Button>
            <Button 
              variant={uploadMethod === "url" ? "default" : "outline"} 
              onClick={() => setUploadMethod("url")}
              size="sm"
              className="flex-1"
            >
              <FileText size={16} className="mr-2" />
              URL
            </Button>
          </div>
          
          <Tabs defaultValue="image" onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image size={14} />
                Imagem
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <FileAudio size={14} />
                Áudio
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-2">
                <FileText size={14} />
                Documento
              </TabsTrigger>
            </TabsList>
            
            {uploadMethod === "file" ? (
              <div 
                className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={handleBrowseClick}
              >
                {selectedFile ? (
                  <div className="text-center">
                    <div className="mb-2 text-primary">
                      {mediaType === 'image' ? <Image size={24} /> : 
                       mediaType === 'audio' ? <FileAudio size={24} /> : 
                       <FileText size={24} />}
                    </div>
                    <p className="font-medium mb-1">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Escolher outro arquivo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 text-muted-foreground" size={24} />
                    <p className="text-sm font-medium mb-1">Arraste um arquivo ou clique aqui</p>
                    <p className="text-xs text-muted-foreground">
                      Formatos suportados: JPG, PNG, PDF, MP3, MP4
                    </p>
                  </>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept={mediaType === 'image' ? 'image/*' : 
                          mediaType === 'audio' ? 'audio/*' : 
                          "*/*"}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="media-url">URL da mídia</Label>
                  <Input
                    id="media-url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://example.com/media.jpg"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </Tabs>
          
          <div>
            <Label htmlFor="file-name">Nome do arquivo</Label>
            <Input
              id="file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Nome do arquivo"
              className="mt-1"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>Enviar</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMediaDialog;
