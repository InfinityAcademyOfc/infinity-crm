
import React, { useEffect, forwardRef } from "react";
import FloatingFormatToolbar from "./toolbar/FloatingFormatToolbar";
import { useEditorState } from "./hooks/useEditorState";
import { useCollaborators } from "./hooks/useCollaborators";

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
  const {
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
  } = useEditorState(onUpdateContent);

  const { collaborators } = useCollaborators();

  // Safely initialize content - only run once when component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content.replace(/\n/g, "<br/>");
    }
  }, []);

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
