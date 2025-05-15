
import { useState, useRef, useEffect, useCallback } from 'react';

export function useEditorState(onUpdateContent: (content: string) => void) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ top: 0, left: 0 });

  // Safe selection handler that checks for editor existence before manipulating
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current || !isFocused) {
      setShowFormatToolbar(false);
      return;
    }

    const selectionText = selection.toString();
    setSelectedText(selectionText);

    if (selectionText && selection.rangeCount > 0) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();

        setFormatToolbarPosition({
          top: rect.top + window.scrollY - editorRect.top + 36,
          left: rect.left + window.scrollX - editorRect.left + (rect.width / 2)
        });
        setShowFormatToolbar(true);
      } catch (error) {
        console.error("Error handling selection change:", error);
        setShowFormatToolbar(false);
      }
    } else {
      setShowFormatToolbar(false);
    }
  }, [isFocused]);

  // Add selection change listener with proper cleanup
  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (editorRef.current && e.currentTarget === e.target) {
      try {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        editorRef.current.focus();
      } catch (error) {
        console.error("Error handling mouse down:", error);
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      try {
        const newContent = editorRef.current.innerHTML.replace(/<br>/g, "\n");
        onUpdateContent(newContent);
      } catch (error) {
        console.error("Error handling input:", error);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    try {
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    } catch (error) {
      console.error("Error handling paste:", error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log("File dropped:", files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFormatAction = (action: string, value?: string) => {
    try {
      if (action === "fontSize") {
        document.execCommand("fontSize", false, "7");
        const sel = window.getSelection();
        if (sel && sel.anchorNode?.parentElement && value) {
          sel.anchorNode.parentElement.style.fontSize = value;
        }
      } else if (["fontName", "foreColor", "backColor"].includes(action)) {
        document.execCommand(action, false, value);
      } else {
        document.execCommand(action, false, value);
      }
    } catch (error) {
      console.error(`Error applying format ${action}:`, error);
    }
  };

  // Use useEffect to handle blur with a timeout
  useEffect(() => {
    let blurTimeout: number | null = null;
    
    if (!isFocused) {
      blurTimeout = window.setTimeout(() => {
        if (!document.activeElement?.closest('.floating-format-toolbar')) {
          setShowFormatToolbar(false);
        }
      }, 100);
    }
    
    return () => {
      if (blurTimeout !== null) {
        window.clearTimeout(blurTimeout);
      }
    };
  }, [isFocused]);

  return {
    editorRef,
    isFocused,
    setIsFocused,
    showFormatToolbar,
    formatToolbarPosition,
    handleMouseDown,
    handleInput,
    handlePaste,
    handleDrop,
    handleDragOver,
    handleFormatAction
  };
}
