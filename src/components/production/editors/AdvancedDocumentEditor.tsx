
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedDocumentEditorProps {
  data: any;
  onChange: (data: any) => void;
  projectId: string;
}

export default function AdvancedDocumentEditor({ 
  data, 
  onChange, 
  projectId 
}: AdvancedDocumentEditorProps) {
  const [content, setContent] = useState(data.content || '');
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (content !== data.content) {
      onChange({ ...data, content, version: (data.version || 1) + 1 });
    }
  }, [content, data, onChange]);

  const handleFormat = (format: string) => {
    if (!editorRef.current) return;

    switch (format) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'list':
        document.execCommand('insertUnorderedList');
        break;
      case 'ordered-list':
        document.execCommand('insertOrderedList');
        break;
      case 'quote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
      case 'link':
        const url = prompt('Digite a URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      case 'image':
        const imageUrl = prompt('Digite a URL da imagem:');
        if (imageUrl) {
          document.execCommand('insertImage', false, imageUrl);
        }
        break;
      case 'align-left':
        document.execCommand('justifyLeft');
        break;
      case 'align-center':
        document.execCommand('justifyCenter');
        break;
      case 'align-right':
        document.execCommand('justifyRight');
        break;
      case 'undo':
        document.execCommand('undo');
        break;
      case 'redo':
        document.execCommand('redo');
        break;
    }

    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    
    setActiveFormats(formats);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertTemplate = (template: string) => {
    let templateContent = '';
    
    switch (template) {
      case 'heading':
        templateContent = '<h1>Título Principal</h1><p>Conteúdo aqui...</p>';
        break;
      case 'section':
        templateContent = '<h2>Seção</h2><p>Descrição da seção...</p>';
        break;
      case 'table':
        templateContent = `
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <tr>
              <th style="padding: 8px;">Coluna 1</th>
              <th style="padding: 8px;">Coluna 2</th>
              <th style="padding: 8px;">Coluna 3</th>
            </tr>
            <tr>
              <td style="padding: 8px;">Dados 1</td>
              <td style="padding: 8px;">Dados 2</td>
              <td style="padding: 8px;">Dados 3</td>
            </tr>
          </table>
        `;
        break;
      case 'checklist':
        templateContent = `
          <ul style="list-style: none; padding-left: 0;">
            <li>☐ Item 1</li>
            <li>☐ Item 2</li>
            <li>☐ Item 3</li>
          </ul>
        `;
        break;
    }

    if (editorRef.current && templateContent) {
      document.execCommand('insertHTML', false, templateContent);
      handleInput();
    }
  };

  const toolbarButtons = [
    { icon: Undo, action: 'undo', label: 'Desfazer' },
    { icon: Redo, action: 'redo', label: 'Refazer' },
    { type: 'separator' },
    { icon: Bold, action: 'bold', label: 'Negrito' },
    { icon: Italic, action: 'italic', label: 'Itálico' },
    { icon: Underline, action: 'underline', label: 'Sublinhado' },
    { type: 'separator' },
    { icon: List, action: 'list', label: 'Lista' },
    { icon: ListOrdered, action: 'ordered-list', label: 'Lista Numerada' },
    { icon: Quote, action: 'quote', label: 'Citação' },
    { type: 'separator' },
    { icon: AlignLeft, action: 'align-left', label: 'Alinhar à Esquerda' },
    { icon: AlignCenter, action: 'align-center', label: 'Centralizar' },
    { icon: AlignRight, action: 'align-right', label: 'Alinhar à Direita' },
    { type: 'separator' },
    { icon: Link, action: 'link', label: 'Link' },
    { icon: Image, action: 'image', label: 'Imagem' },
    { icon: Table, action: 'table', label: 'Tabela' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center gap-1 flex-wrap">
        {toolbarButtons.map((button, index) => (
          button.type === 'separator' ? (
            <div key={index} className="w-px h-6 bg-border mx-1" />
          ) : (
            <Button
              key={button.action}
              variant={activeFormats.has(button.action!) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFormat(button.action!)}
              title={button.label}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          )
        ))}
        
        <div className="ml-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertTemplate('heading')}
          >
            Título
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertTemplate('section')}
          >
            Seção
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertTemplate('table')}
          >
            Tabela
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertTemplate('checklist')}
          >
            Checklist
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <Card className="h-full">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onKeyUp={updateActiveFormats}
              onMouseUp={updateActiveFormats}
              className="h-full p-6 outline-none prose prose-slate max-w-none"
              style={{ minHeight: '400px' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Card>
        </div>
        
        {/* Side panel with document stats and outline */}
        <div className="w-80 border-l p-4 space-y-4">
          <div>
            <h3 className="font-medium mb-2">Estatísticas</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>Palavras: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length}</div>
              <div>Caracteres: {content.replace(/<[^>]*>/g, '').length}</div>
              <div>Parágrafos: {(content.match(/<p>/g) || []).length}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Estilos Rápidos</h3>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => document.execCommand('formatBlock', false, 'h1')}
              >
                Título 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => document.execCommand('formatBlock', false, 'h2')}
              >
                Título 2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => document.execCommand('formatBlock', false, 'h3')}
              >
                Título 3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => document.execCommand('formatBlock', false, 'p')}
              >
                Parágrafo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
