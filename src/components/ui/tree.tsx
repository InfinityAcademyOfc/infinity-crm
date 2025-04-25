import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};
const Tree = React.forwardRef<HTMLDivElement, TreeProps>(({
  className,
  children,
  ...props
}, ref) => {
  return <div ref={ref} className={cn("tree", className)} {...props}>
        {children}
      </div>;
});
Tree.displayName = "Tree";
interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: React.ReactNode; // Changed from 'string' to 'React.ReactNode' to accept elements
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  onClick?: () => void;
}
const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(({
  className,
  icon,
  label,
  defaultOpen = false,
  children,
  actions,
  onClick,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const hasChildren = React.Children.count(children) > 0;
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };
  return <div ref={ref} className={cn("tree-item", className)} {...props}>
        <div className={cn("flex items-center py-1 px-2 rounded-md hover:bg-secondary/50 cursor-pointer", onClick && "hover:bg-primary/10")} onClick={e => {
      if (onClick) {
        e.stopPropagation();
        onClick();
      } else if (hasChildren) {
        handleToggle(e);
      }
    }}>
          {hasChildren}
          {!hasChildren && <div className="w-4 mr-1" />}
          {icon && <div className="mr-2 text-muted-foreground">{icon}</div>}
          <span className="text-sm truncate flex-1">{label}</span>
          {actions && <div className="ml-auto opacity-0 group-hover:opacity-100 hover:opacity-100" onClick={e => e.stopPropagation()}>
              {actions}
            </div>}
        </div>
        {hasChildren && isOpen && <div className="pl-6 border-l border-border ml-2 mt-1">
            {children}
          </div>}
      </div>;
});
TreeItem.displayName = "TreeItem";
export { Tree, TreeItem };