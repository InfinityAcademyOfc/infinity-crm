
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Users, Maximize2, Minimize2, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DocumentCoverProps {
  cover: string;
  title: string;
  collaborators: any[];
  isFullscreen: boolean;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleChange: (value: string) => void;
  onToggleFullscreen: () => void;
  onClose?: () => void;
}

export function DocumentCover({
  cover,
  title,
  collaborators,
  isFullscreen,
  onCoverChange,
  onTitleChange,
  onToggleFullscreen,
  onClose
}: DocumentCoverProps) {
  const [coverBlur, setCoverBlur] = useState(5);
  const [coverShadow, setCoverShadow] = useState(50);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      className="relative h-60 flex flex-col justify-end bg-gray-100 dark:bg-neutral-800 rounded-t-lg overflow-hidden"
      style={{ position: 'relative' }}
    >
      <div className="absolute w-full h-full">
        <img 
          src={cover} 
          alt="Capa" 
          className="absolute w-full h-full object-cover" 
          style={{ 
            filter: `blur(${coverBlur}px)`,
            opacity: 0.8
          }} 
        />
        <div 
          className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black" 
          style={{ opacity: coverShadow / 100 }}
        />
      </div>
      
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="bg-black/40 hover:bg-black/50 text-white">
              Personalizar capa
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="blur" className="text-sm font-medium">Desfoque</label>
                  <span className="text-xs text-muted-foreground">{coverBlur}</span>
                </div>
                <Slider
                  id="blur"
                  min={0}
                  max={10}
                  step={0.5}
                  value={[coverBlur]}
                  onValueChange={(values) => setCoverBlur(values[0])}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="shadow" className="text-sm font-medium">Sombra</label>
                  <span className="text-xs text-muted-foreground">{coverShadow}%</span>
                </div>
                <Slider
                  id="shadow"
                  min={0}
                  max={100}
                  step={5}
                  value={[coverShadow]}
                  onValueChange={(values) => setCoverShadow(values[0])}
                />
              </div>
              <Button 
                onClick={() => filePickerRef.current?.click()}
                className="w-full"
              >
                Trocar imagem
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" className="bg-black/40 hover:bg-black/50 text-white">
              <Users className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Colaboradores ativos</h4>
              <div className="space-y-1">
                {collaborators.map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback style={{ backgroundColor: user.color }}>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <span 
                      className="h-2 w-2 rounded-full bg-green-500"
                      title="Online agora"
                    />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Button
          variant="secondary"
          size="icon"
          className="bg-black/40 hover:bg-black/50 text-white"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        
        {isFullscreen && onClose && (
          <Button
            variant="secondary"
            size="icon"
            className="bg-black/40 hover:bg-black/50 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="relative z-10 flex flex-row items-end gap-2 p-6">
        <input
          className="bg-transparent font-bold text-3xl px-4 py-2 outline-none w-full max-w-lg shadow-none border-0 focus:ring-0"
          value={title}
          ref={titleInputRef}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Digite o título..."
          style={{ color: '#fff', textShadow: "0 2px 8px rgba(0,0,0,0.22)" }}
        />
      </div>
      
      <input
        type="file"
        ref={filePickerRef}
        accept="image/*"
        className="hidden"
        onChange={onCoverChange}
      />
    </div>
  );
}
