import React, { useState } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const {
    toast
  } = useToast();
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);

      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = e => {
        // Set the image data to state
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          setUploadingImage(false);
          toast({
            title: "Imagem atualizada",
            description: "Sua foto de perfil foi atualizada com sucesso."
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileImage || "/avatar-placeholder.jpg"} alt="Profile picture" className="object-cover" />
              <AvatarFallback className="text-2xl">CS</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center">
              <Label htmlFor="picture" className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors">
                <Camera size={16} />
                {uploadingImage ? "Carregando..." : "Alterar foto"}
              </Label>
              <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              {profileImage && <Button variant="link" size="sm" onClick={() => setProfileImage(null)} className="mt-2">
                  Remover foto
                </Button>}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue="Carlos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Sobrenome</Label>
                <Input id="lastname" defaultValue="Silva" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="carlos.silva@exemplo.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Cargo</Label>
              <Input id="role" defaultValue="Administrador" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" defaultValue="(11) 98765-4321" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="mt-4">Salvar Alterações</Button>
        </div>
      </CardContent>
    </Card>;
};
export default ProfileSettings;