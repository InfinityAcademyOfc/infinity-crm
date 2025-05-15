
import { useState } from 'react';

export function useFullscreen(editorRef: React.RefObject<HTMLDivElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen && editorRef.current) {
      setTimeout(() => {
        editorRef.current?.focus();
      }, 100);
    }
  };

  return {
    isFullscreen,
    toggleFullscreen
  };
}
