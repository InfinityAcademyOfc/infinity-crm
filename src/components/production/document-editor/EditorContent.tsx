import React, { useEffect, forwardRef, useRef, useState, useCallback } from "react";
import FloatingFormatToolbar from "./toolbar/FloatingFormatToolbar";
import { logError } from "@/utils/logger"; // Importar o logger

interface EditorContentProps {
  content: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  textAlignment: string;
  onUpdateContent: (content: string) => void;
}

const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(({
  content,
  fontFamily,
  textColor,
  backgroundColor,
  textAlignment,
  onUpdateContent,
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ top: 0, left: 0 });
  const [collaborators, setCollaborators] = useState<{id: string, name: string, color: string, position: {x: number, y: number}}[]>([
    { id: 'user1', name: 'Ana Silva', color: '#FF5733', position: { x: 150, y: 80 } },
    { id: 'user2', name: 'Carlos Mendes', color: '#33FF57', position: { x: 300, y: 120 } }
  ]);

  // Safely initialize content - only run once when component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content.replace(/\n/g, "<br/>");
    }
  }, []);

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
        logError("Error handling selection change:", error, { component: "EditorContent" });
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

  // Handle collaborator animation with proper interval cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(user => ({
        ...user,
        position: {
          x: Math.min(Math.max(user.position.x + (Math.random() * 40 - 20), 50), 700),
          y: Math.min(Math.max(user.position.y + (Math.random() * 40 - 20), 50), 400)
        }
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

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
        logError("Error handling mouse down:", error, { component: "EditorContent" });
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      try {
        const newContent = editorRef.current.innerHTML.replace(/<br>/g, "\n");
        onUpdateContent(newContent);
      } catch (error) {
        logError("Error handling input:", error, { component: "EditorContent" });
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    try {
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    } catch (error) {
      logError("Error handling paste:", error, { component: "EditorContent" });
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
      logError(`Error applying format ${action}:`, error, { component: "EditorContent" });
    }
  };

  // Use useEffect to handle blur with a timeout
  useEffect(() => {
    let blurTimeout: number | null = null;
    
    if (!isFocused) {
      blurTimeout = window.setTimeout(() => {
        if (!document.activeElement?.closest(".floating-format-toolbar")) {
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

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full p-8 outline-none overflow-auto notion-content"
        contentEditable={true}
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          editorRef.current = node;
        }}
        onInput={handleInput}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          fontFamily,
          color: textColor,
          backgroundColor,
          textAlign: textAlignment as "left" | "center" | "right" | "justify",
          position: "relative",
          minHeight: "100%",
        }}
        suppressContentEditableWarning
        spellCheck
      />
      {showFormatToolbar && (
        <FloatingFormatToolbar
          position={formatToolbarPosition}
          onFormatAction={handleFormatAction}
        />
      )}
      {collaborators.map(user => (
        <div 
          key={user.id}
          className="absolute pointer-events-none transition-all duration-500 ease-in-out z-20"
          style={{
            left: `${user.position.x}px`,
            top: `${user.position.y}px`
          }}
        >
          <div 
            className="h-5 w-0.5 -translate-x-1/2"
            style={{ backgroundColor: user.color }}
          ></div>
          <div 
            className="text-xs px-2 py-0.5 rounded-md -translate-x-1/2 whitespace-nowrap"
            style={{ backgroundColor: user.color }}
          >
            {user.name}
          </div>
        </div>
      ))}
    </div>
  );
});

EditorContent.displayName = "EditorContent";

export default EditorContent;


