
import { useCallback } from 'react';

interface KeyboardShortcutsProps {
  editorRef: React.RefObject<HTMLDivElement>;
  setContent: (content: string) => void;
  handleFormatAction: (action: string, value?: string) => void;
  saveCurrentSelection: () => void;
}

export function useKeyboardShortcuts({
  editorRef,
  setContent,
  handleFormatAction,
  saveCurrentSelection
}: KeyboardShortcutsProps) {
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [editorRef, setContent, handleFormatAction, saveCurrentSelection]);

  return { handleKeyDown };
}
