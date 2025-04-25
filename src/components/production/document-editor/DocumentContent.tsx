import React, { useState, useEffect, useRef } from 'react';
import FloatingFormatToolbar from './toolbar/FloatingFormatToolbar';
import { useDocumentContext } from '../document-explorer/contexts/DocumentContext';
import { DocumentItem } from '../document-explorer/types';
import { Button } from '@/components/ui/button';
interface DocumentContentProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  documentId: string;
}
const defaultCover = "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80";
const defaultTitle = "Documento sem título";
const DocumentContent: React.FC<DocumentContentProps> = ({
  initialContent,
  onContentChange,
  documentId
}) => {
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({
    top: 0,
    left: 0
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [cover, setCover] = useState<string>(defaultCover);
  const [title, setTitle] = useState<string>(defaultTitle);
  const [showTitleToolbar, setShowTitleToolbar] = useState(false);
  const [titleToolbarPos, setTitleToolbarPos] = useState({
    top: 0,
    left: 0
  });
  const titleInputRef = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  useEffect(() => setContent(initialContent), [initialContent, documentId]);
  useEffect(() => {
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

  // Editor flutuante para corpo
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && editorRef.current && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      // Melhor alinhamento: toolbar acima da seleção, centralizada
      setToolbarPosition({
        top: rect.top - editorRect.top - 44,
        // 44px para acima
        left: rect.left + rect.width / 2 - editorRect.left
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  // Floating toolbar para o título
  const handleTitleSelection = () => {
    if (titleInputRef.current) {
      const rect = titleInputRef.current.getBoundingClientRect();
      setTitleToolbarPos({
        top: rect.top - titleInputRef.current.offsetHeight * 1.5 - 6,
        left: rect.left + rect.width * 0.5
      });
      setShowTitleToolbar(true);
    }
  };

  // Permite edição rica do título (basicamente negrito, itálico, etc)
  // Aqui, como o título é state string, finge edição (não real RTE).
  const handleTitleFormat = (action: string) => {
    if (action === "bold") setTitle(t => `**${t}**`);else if (action === "italic") setTitle(t => `_${t}_`);
    // Adapte para mais conforme desejado
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
  return <div className="h-full flex flex-col bg-background">
      <div className="relative h-60 flex flex-col justify-end bg-gray-100 dark:bg-neutral-800 rounded-t-lg overflow-hidden">
        <img src={cover} alt="Capa" className="absolute w-full h-full object-cover opacity-80" />
        <div className="relative z-10 flex flex-row items-end gap-2 p-6">
          <input className="bg-transparent font-bold text-3xl px-4 py-2 outline-none w-full max-w-lg shadow-none border-0 focus:ring-0" value={title} ref={titleInputRef} onChange={e => setTitle(e.target.value)} placeholder="Digite o título..." onSelect={handleTitleSelection} onBlur={() => setShowTitleToolbar(false)} style={{
          color: '#fff',
          textShadow: "0 2px 8px rgba(0,0,0,0.22)"
        }} />
          <Button variant="ghost" size="sm" className="ml-1" onClick={() => filePickerRef.current?.click()} title="Trocar capa">
            📷
          </Button>
          <input type="file" ref={filePickerRef} accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>
        {showTitleToolbar && <div style={{
        position: "fixed",
        top: titleToolbarPos.top,
        left: titleToolbarPos.left,
        transform: "translate(-50%, -100%)",
        zIndex: 50
      }}>
            <FloatingFormatToolbar position={{
          top: 0,
          left: 0
        }} onFormatAction={handleTitleFormat} />
          </div>}
      </div>
      {showToolbar && <FloatingFormatToolbar position={toolbarPosition} onFormatAction={handleFormatAction} />}
      <div ref={editorRef} contentEditable dangerouslySetInnerHTML={{
      __html: content
    }} onInput={e => setContent((e.target as HTMLDivElement).innerHTML)} onMouseUp={handleSelectionChange} onKeyUp={handleSelectionChange} suppressContentEditableWarning className="prose prose-lg dark:prose-invert max-w-none flex-1 p-4 overflow-auto focus:outline-none bg-gray-950" />
    </div>;
};
export default DocumentContent;