
import { useState, useEffect } from 'react';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
}

export function useCollaborators() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 'user1', name: 'Ana Silva', color: '#FF5733', position: { x: 150, y: 80 } },
    { id: 'user2', name: 'Carlos Mendes', color: '#33FF57', position: { x: 300, y: 120 } }
  ]);

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

  return { collaborators };
}
