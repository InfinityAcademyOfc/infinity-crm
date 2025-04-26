
import React from 'react';
import { File, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentItem } from '../../types';
import { cn } from '@/lib/utils';

interface TreeItemIconProps {
  item: DocumentItem;
  isFolder: boolean;
  isExpanded: boolean;
  isImportFolder: boolean;
  folderColor: string;
  onToggleExpanded: (id: string) => void;
  dragHandleProps: any;
}

export const TreeItemIcon: React.FC<TreeItemIconProps> = ({
  item,
  isFolder,
  isExpanded,
  isImportFolder,
  folderColor,
  onToggleExpanded,
  dragHandleProps
}) => {
  return (
    <div className="flex items-center">
      {!isImportFolder && (
        <div 
          {...dragHandleProps} 
          className="cursor-grab hover:bg-muted/30 rounded mr-1"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      
      {isFolder && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-4 w-4 p-0 mr-1 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded(item.id);
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground dark:text-gray-400 dark:neon-text" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground dark:text-gray-400 dark:neon-text" />
          )}
        </Button>
      )}
      
      <span className="h-4 w-4">
        {isFolder ? (
          <div className="relative group">
            <div 
              className={cn(
                "h-4 w-6 rounded-[0.25rem] border border-gray-300 dark:border-gray-600",
                "group-hover:brightness-95 cursor-pointer mr-1",
                "dark:shadow-sm dark:hover:shadow-md dark:transition-shadow"
              )}
              style={{
                background: folderColor,
                transition: "all 0.3s"
              }} 
              title="Cor da pasta"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(item.id);
              }}
            />
          </div>
        ) : (
          <File className="h-4 w-4 text-muted-foreground dark:text-gray-300" />
        )}
      </span>
    </div>
  );
};
