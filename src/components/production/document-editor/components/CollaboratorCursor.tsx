
import React from 'react';

interface CollaboratorCursorProps {
  user: {
    id: string;
    name: string;
    color: string;
    position?: { x: number; y: number };
  };
}

export function CollaboratorCursor({ user }: CollaboratorCursorProps) {
  if (!user.position) return null;

  return (
    <div 
      className="absolute pointer-events-none transition-all duration-500 ease-in-out z-20"
      style={{
        left: `${user.position.x}px`,
        top: `${user.position.y}px`,
      }}
    >
      <div 
        className="h-5 w-0.5 -translate-x-1/2"
        style={{ backgroundColor: user.color }}
      />
      <div 
        className="text-xs px-2 py-0.5 rounded-md -translate-x-1/2 whitespace-nowrap text-white"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </div>
  );
}
