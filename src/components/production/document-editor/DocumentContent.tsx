
import React, { useState } from 'react';
import { useDocumentContext } from '../document-explorer/contexts/DocumentContext';
import { DocumentCover } from './components/DocumentCover';
import { CollaboratorCursor } from './components/CollaboratorCursor';
import FloatingFormatToolbar from './toolbar/FloatingFormatToolbar';
import { useDocumentEditor } from './hooks/useDocumentEditor';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFullscreen } from './hooks/useFullscreen';

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
  const [cover, setCover] = useState<string>(defaultCover);
  const [title, setTitle] = useState<string>(defaultTitle);
  const { collaborators } = useDocumentContext();
  
  const {
    content,
    setContent,
    showToolbar,
    toolbarPosition,
    editorRef,
    handleSelectionChange,
    handleFormatAction,
    saveCurrentSelection
  } = useDocumentEditor(initialContent, onContentChange);
  
  const { isFullscreen, toggleFullscreen } = useFullscreen(editorRef);
  
  const { handleKeyDown } = useKeyboardShortcuts({
    editorRef,
    setContent,
    handleFormatAction,
    saveCurrentSelection
  });

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
        onClose={isFullscreen ? () => toggleFullscreen() : undefined}
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
