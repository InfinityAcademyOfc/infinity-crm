
import React from 'react';
import { Button } from '@/components/ui/button';

interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
}

export const ActionButton = ({ icon, label, onClick, variant = 'default' }: ActionButtonProps) => {
  return (
    <Button variant={variant} onClick={onClick} className="flex items-center gap-2">
      {icon}
      {label}
    </Button>
  );
};

export const SectionHeader = ({ title, description, children, actions }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {(children || actions) && (
        <div className="flex items-center gap-2">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
};
