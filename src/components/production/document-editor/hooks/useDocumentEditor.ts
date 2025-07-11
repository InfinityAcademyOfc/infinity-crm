
import { useState, useRef, useCallback } from 'react';

export const useDocumentEditor = (initialContent: string, onContentChange: (content: string) => void) => {
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [cover, setCover] = useState<string>("https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80");
  const [title, setTitle] = useState<string>("Documento sem título");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectionRangeRef = useRef<Range | null>(null);

  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
    } else {
      selectionRangeRef.current = null;
    }
  };

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
      
      selectionRangeRef.current = range.cloneRange();
      
      setToolbarPosition({
        top: rect.top + window.scrollY - 10,
        left: rect.left + rect.width / 2 + window.scrollX
      });
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, []);

  const handleFormatAction = (action: string, value?: string) => {
    restoreSelection();
    document.execCommand(action, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    saveCurrentSelection();
  };

  const handleContentUpdate = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
    
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => onContentChange(newContent), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    saveCurrentSelection();
    
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormatAction('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormatAction('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormatAction('underline');
          break;
        case 'z':
          e.preventDefault();
          document.execCommand('undo');
          if (editorRef.current) setContent(editorRef.current.innerHTML);
          break;
        case 'y':
          e.preventDefault();
          document.execCommand('redo');
          if (editorRef.current) setContent(editorRef.current.innerHTML);
          break;
        default:
          break;
      }
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

  return {
    content,
    showToolbar,
    toolbarPosition,
    cover,
    setCover,
    title,
    setTitle,
    isFullscreen,
    editorRef,
    handleSelectionChange,
    handleFormatAction,
    handleContentUpdate,
    handleKeyDown,
    toggleFullscreen,
    autoSaveTimerRef
  };
};
