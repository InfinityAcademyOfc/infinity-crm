
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type
} from 'lucide-react';
import { ProductionProject } from '@/hooks/useProductionWorkspace';

interface DocumentEditorProps {
  project: ProductionProject;
  onUpdate: (id: string, updates: Partial<ProductionProject>) => Promise<ProductionProject | null>;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({ project, onUpdate }) => {
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (project.data?.content) {
      setContent(project.data.content);
    }
  }, [project]);

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharCount(content.length);
  }, [content]);

  const handleContentChange = (value: string) => {
    setContent(value);
    // Auto-save será feito pelo componente pai
  };

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    let newContent = '';
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        break;
      case 'h1':
        newText = `# ${selectedText}`;
        break;
      case 'h2':
        newText = `## ${selectedText}`;
        break;
      case 'h3':
        newText = `### ${selectedText}`;
        break;
      case 'ul':
        newText = `- ${selectedText}`;
        break;
      case 'ol':
        newText = `1. ${selectedText}`;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        break;
      default:
        newText = selectedText;
    }

    newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    // Restaurar foco
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const saveContent = async () => {
    await onUpdate(project.id, {
      data: {
        ...project.data,
        content
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('h1')}
            title="Título 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('h2')}
            title="Título 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('h3')}
            title="Título 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('bold')}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('italic')}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('underline')}
            title="Sublinhado"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('ul')}
            title="Lista com marcadores"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('ol')}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('quote')}
            title="Citação"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Type className="h-3 w-3 mr-1" />
            {wordCount} palavras
          </Badge>
          <Badge variant="outline" className="text-xs">
            {charCount} caracteres
          </Badge>
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onBlur={saveContent}
          placeholder="Comece a escrever seu documento..."
          className="min-h-[400px] resize-none font-mono text-sm"
        />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Use Markdown para formatação: **negrito**, *itálico*, # título</span>
          <span>Salvo automaticamente</span>
        </div>
      </div>

      {/* Preview */}
      {content && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Visualização</h3>
          <div className="border rounded-lg p-4 bg-background">
            <div className="prose prose-sm max-w-none">
              {content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mb-2">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold mb-2">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-bold mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('> ')) {
                  return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic">{line.substring(2)}</blockquote>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4">{line.substring(2)}</li>;
                } else if (line.match(/^\d+\. /)) {
                  return <li key={index} className="ml-4">{line.substring(line.indexOf(' ') + 1)}</li>;
                } else {
                  const formattedLine = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
                  return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;
