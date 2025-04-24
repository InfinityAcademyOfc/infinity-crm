import React, { useEffect, forwardRef, useRef, useState } from "react";
import FloatingFormatToolbar from "./toolbar/FloatingFormatToolbar";

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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content.replace(/\n/g, "<br/>");
      
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection && selection.toString() && isFocused && editorRef.current && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();

      setFormatToolbarPosition({
        top: rect.top + window.scrollY - editorRect.top + 36,
        left: rect.left + window.scrollX - editorRect.left + (rect.width / 2)
      });
      setSelectedText(selection.toString());
      setShowFormatToolbar(true);
    } else {
      setSelectedText("");
      setShowFormatToolbar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [isFocused]);

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
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      editorRef.current.focus();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML.replace(/<br>/g, "\n");
      onUpdateContent(newContent);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
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
    if (action === "fontSize") {
      document.execCommand("fontSize", false, "7");
      document.queryCommandValue("fontSize");
      const sel = window.getSelection();
      if (sel && sel.anchorNode?.parentElement && value) {
        sel.anchorNode.parentElement.style.fontSize = value;
      }
    } else if (["fontName", "foreColor", "backColor"].includes(action)) {
      document.execCommand(action, false, value);
    } else {
      document.execCommand(action, false, value);
    }
  };

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
        onBlur={() => {
          setIsFocused(false);
          setTimeout(() => {
            if (!document.activeElement?.closest('.floating-format-toolbar')) {
              setShowFormatToolbar(false);
            }
          }, 100);
        }}
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
