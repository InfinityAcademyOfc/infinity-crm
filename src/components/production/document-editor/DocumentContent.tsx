import React, { useState, useEffect, useRef, useCallback } from 'react';
import FloatingFormatToolbar from './toolbar/FloatingFormatToolbar';
import { useDocumentContext } from '../document-explorer/contexts/DocumentContext';
import { DocumentItem } from '../document-explorer/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X, Users } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DocumentContentProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  documentId: string;
}

const defaultCover = "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80";
const defaultTitle = "Documento sem título";

const DocumentContent: React.FC<DocumentContentProps> = ({ initialContent, onContentChange, documentId }) => {
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [cover, setCover] = useState<string>(defaultCover);
  const [title, setTitle] = useState<string>(defaultTitle);
  const [showTitleToolbar, setShowTitleToolbar] = useState(false);
  const [titleToolbarPos, setTitleToolbarPos] = useState({ top: 0, left: 0 });
  const titleInputRef = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [coverBlur, setCoverBlur] = useState(5); // Blur value from 0-10
  const [coverShadow, setCoverShadow] = useState(50); // Shadow opacity from 0-100
  const { collaborators } = useDocumentContext();

  useEffect(() => setContent(initialContent), [initialContent, documentId]);

  useEffect(() => {
    onContentChange(content);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => onContentChange(content), 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [content, onContentChange]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        onContentChange(content);
      }
    };
  }, []);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && editorRef.current && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      setToolbarPosition({
        top: rect.top - editorRect.top - 10,
        left: rect.left + (rect.width / 2)
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, []);

  const handleTitleSelection = () => {
    if (titleInputRef.current) {
      const rect = titleInputRef.current.getBoundingClientRect();
      setTitleToolbarPos({
        top: rect.top - (titleInputRef.current.offsetHeight * 1.5) - 6,
        left: rect.left + rect.width * 0.5,
      });
      setShowTitleToolbar(true);
    }
  };

  const handleTitleFormat = (action: string) => {
    if (action === "bold") setTitle(t => `**${t}**`);
    else if (action === "italic") setTitle(t => `_${t}_`);
    setShowTitleToolbar(false);
  };

  const handleFormatAction = (action: string, value?: string) => {
    document.execCommand(action, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setCover(url);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen && editorRef.current) {
      setTimeout(() => {
        editorRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
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
          ></div>
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
                      ></span>
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
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          {isFullscreen && (
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/40 hover:bg-black/50 text-white"
              onClick={() => setIsFullscreen(false)}
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
            onChange={e => setTitle(e.target.value)}
            placeholder="Digite o título..."
            onSelect={handleTitleSelection}
            onBlur={() => setShowTitleToolbar(false)}
            style={{ color: '#fff', textShadow: "0 2px 8px rgba(0,0,0,0.22)" }}
          />
        </div>
        
        <input
          type="file"
          ref={filePickerRef}
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />
        
        {showTitleToolbar &&
          <div style={{
            position: "fixed",
            top: titleToolbarPos.top,
            left: titleToolbarPos.left,
            transform: "translate(-50%, -100%)",
            zIndex: 50
          }}>
            <FloatingFormatToolbar position={{ top: 0, left: 0 }} onFormatAction={handleTitleFormat} />
          </div>
        }
      </div>
      
      {showToolbar && (
        <FloatingFormatToolbar
          position={toolbarPosition}
          onFormatAction={handleFormatAction}
        />
      )}
      
      <div
        ref={editorRef}
        className="prose prose-lg dark:prose-invert max-w-none flex-1 p-4 overflow-auto focus:outline-none"
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={e => setContent((e.target as HTMLDivElement).innerHTML)}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        suppressContentEditableWarning
      />
      
      {collaborators.map(user => (
        <div 
          key={user.id}
          className="absolute pointer-events-none transition-all duration-500 ease-in-out z-20"
          style={{
            left: `${user.position?.x || 0}px`,
            top: `${user.position?.y || 0}px`,
            display: user.position ? 'block' : 'none'
          }}
        >
          <div 
            className="h-5 w-0.5 -translate-x-1/2"
            style={{ backgroundColor: user.color }}
          ></div>
          <div 
            className="text-xs px-2 py-0.5 rounded-md -translate-x-1/2 whitespace-nowrap text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentContent;
