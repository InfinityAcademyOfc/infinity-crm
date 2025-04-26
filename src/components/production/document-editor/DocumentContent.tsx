
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDocumentContext } from '../document-explorer/contexts/DocumentContext';
import { DocumentItem } from '../document-explorer/types';
import { DocumentCover } from './components/DocumentCover';
import { CollaboratorCursor } from './components/CollaboratorCursor';
import FloatingFormatToolbar from './toolbar/FloatingFormatToolbar';

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
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [cover, setCover] = useState<string>(defaultCover);
  const [title, setTitle] = useState<string>(defaultTitle);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { collaborators } = useDocumentContext();
  const selectionRangeRef = useRef<Range | null>(null);

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

  // Save current selection range for formatting operations
  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
    } else {
      selectionRangeRef.current = null;
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (selectionRangeRef.current && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(selectionRangeRef.current);
      }
    }
  };

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && editorRef.current && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      
      // Save this selection for later use
      selectionRangeRef.current = range.cloneRange();
      
      setToolbarPosition({
        top: rect.top + window.scrollY - 10, // leva em conta o scroll vertical
        left: rect.left + rect.width / 2 + window.scrollX // leva em conta scroll horizontal
          });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, []);

  const handleFormatAction = (action: string, value?: string) => {
    // Restore selection before applying formatting
    restoreSelection();
    
    document.execCommand(action, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    
    // Save the selection again after formatting
    saveCurrentSelection();
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

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save current selection on any key press
    saveCurrentSelection();
    
    // Handle shortcuts
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b': // Bold
          e.preventDefault();
          handleFormatAction('bold');
          break;
        case 'i': // Italic
          e.preventDefault();
          handleFormatAction('italic');
          break;
        case 'u': // Underline
          e.preventDefault();
          handleFormatAction('underline');
          break;
        case 'c': // Copy
          // Let default browser behavior handle this
          console.log("Copy shortcut detected");
          break;
        case 'v': // Paste
          // Let default browser behavior handle this, but ensure we update content
          setTimeout(() => {
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }, 0);
          break;
        case 'x': // Cut
          // Let default browser behavior handle this, but ensure we update content
          setTimeout(() => {
            if (editorRef.current) {
              setContent(editorRef.current.innerHTML);
            }
          }, 0);
          break;
        case 'z': // Undo
          e.preventDefault();
          document.execCommand('undo');
          if (editorRef.current) setContent(editorRef.current.innerHTML);
          break;
        case 'y': // Redo
          e.preventDefault();
          document.execCommand('redo');
          if (editorRef.current) setContent(editorRef.current.innerHTML);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className={`relative w-full h-full flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <DocumentCover
        cover={cover}
        title={title}
        collaborators={collaborators}
        isFullscreen={isFullscreen}
        onCoverChange={handleCoverChange}
        onTitleChange={setTitle}
        onToggleFullscreen={toggleFullscreen}
        onClose={isFullscreen ? () => setIsFullscreen(false) : undefined}
      />
      
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
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
      />
      
      {collaborators.map(user => (
        <CollaboratorCursor key={user.id} user={user} />
      ))}
    </div>
  );
};

export default DocumentContent;
