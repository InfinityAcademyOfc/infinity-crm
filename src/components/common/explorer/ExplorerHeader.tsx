
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocumentContext } from '../../../components/production/document-explorer/contexts/DocumentContext';

interface ExplorerHeaderProps {
  onAddItem: (parentId: string | null) => void;
}

const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({
  onAddItem
}) => {
  const {
    selectedFolder,
    searchQuery,
    setSearchQuery
  } = useDocumentContext();
  
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-2 py-0 px-[30px]">
        <h3 className="font-semibold">Adicionar</h3>
        <Button variant="ghost" size="sm" onClick={() => onAddItem(selectedFolder)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Input 
        placeholder="Pesquisar..." 
        className="text-sm h-8" 
        value={searchQuery} 
        onChange={e => setSearchQuery(e.target.value)} 
      />
    </div>
  );
};

export default ExplorerHeader;
