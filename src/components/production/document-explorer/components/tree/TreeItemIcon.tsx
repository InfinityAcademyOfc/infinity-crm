import React from 'react';
import { File, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentItem } from '../../types';
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
  return <div className="flex items-center">
      {!isImportFolder && <div {...dragHandleProps} className="cursor-grab hover:bg-muted/30 rounded mr-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>}
      {isFolder}
      <span className="h-4 w-4">
        {isFolder ? <div className="relative group">
            <div className="h-4 w-6 rounded-[0.25rem] border border-gray-300 group-hover:brightness-95 cursor-pointer mr-1" style={{
          background: folderColor,
          transition: "background 0.3s"
        }} title="Cor da pasta"></div>
          </div> : <File className="h-4 w-4" />}
      </span>
    </div>;
};