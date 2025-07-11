
import React, { useEffect } from 'react';
import { useDocumentContext } from '../document-explorer/contexts/DocumentContext';
import { DocumentCover } from './components/DocumentCover';
import { CollaboratorCursor } from './components/CollaboratorCursor';
import FloatingFormatToolbar from './toolbar/FloatingFormatToolbar';
import { useDocumentEditor } from './hooks/useDocumentEditor';

interface DocumentContentProps {
  initialContent: string;
  onContentChange: (content: string) => void;
  documentId: string;
}

const DocumentContent: React.FC<DocumentContentProps> = ({
  initialContent,
  onContentChange,
  documentId
}) => {
  const { collaborators } = useDocumentContext();
  const {
    content,
    showToolbar,
    toolbarPosition,
    cover,
    setCover,
    title,
    setTitle,
    isFullscreen,
    setIsFullscreen,
    editorRef,
    handleSelectionChange,
    handleFormatAction,
    handleContentUpdate,
    handleKeyDown,
    toggleFullscreen,
    autoSaveTimerRef
  } = useDocumentEditor(initialContent, onContentChange);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent.replace(/\n/g, "<br/>");
    }
  }, [initialContent, documentId]);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        onContentChange(content);
      }
    };
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setCover(url);
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
        onInput={e => handleContentUpdate((e.target as HTMLDivElement).innerHTML)}
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
