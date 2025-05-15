
import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyTabContentProps {
  message?: string;
  heading?: string; // Added heading property
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
  description?: string;
  buttonText?: string; // Added buttonText property
}

const EmptyTabContent = ({ 
  message, 
  heading,
  icon: Icon, 
  className = "", 
  onClick,
  description,
  buttonText
}: EmptyTabContentProps) => {
  // Use heading or message depending on which is provided
  const displayMessage = heading || message;
  
  return (
    <div 
      className={`flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-300 dark:border-gray-700 transition-all duration-300 ${onClick ? 'hover:border-primary hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="text-center p-6 max-w-md animate-fade-in">
        {Icon && <Icon className="h-12 w-12 text-primary mb-4 mx-auto opacity-80" />}
        <p className="text-muted-foreground text-lg font-medium mb-2">{displayMessage}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {buttonText && (
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyTabContent;
