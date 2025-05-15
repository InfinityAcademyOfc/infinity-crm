
import { useState, useRef, useCallback, useEffect } from 'react';

export function useDocumentEditor(initialContent: string, onContentChange: (content: string) => void) {
  const [content, setContent] = useState(initialContent);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectionRangeRef = useRef<Range | null>(null);

  // Update content when initialContent changes
  useEffect(() => setContent(initialContent), [initialContent]);

  // Save content changes and trigger autosave
  useEffect(() => {
    onContentChange(content);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => onContentChange(content), 1000);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [content, onContentChange]);

  // Cleanup on unmount
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
      
      // Save this selection for later use
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
    // Restore selection before applying formatting
    restoreSelection();
    
    document.execCommand(action, false, value);
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    
    // Save the selection again after formatting
    saveCurrentSelection();
  };

  return {
    content,
    setContent,
    showToolbar,
    toolbarPosition,
    editorRef,
    selectionRangeRef,
    handleSelectionChange,
    handleFormatAction,
    saveCurrentSelection
  };
}
