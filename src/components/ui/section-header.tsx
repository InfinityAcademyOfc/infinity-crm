
import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const SectionHeader = ({ title, description, children }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
};
