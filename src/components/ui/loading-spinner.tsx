
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("animate-spin rounded-full border-b-2 border-primary", sizeClasses[size], className)} />
  );
};

export const LoadingCard = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-center justify-center min-h-[200px] animate-fade-in">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      {children && <p className="text-muted-foreground">{children}</p>}
    </div>
  </div>
);

export const LoadingPage = ({ message = "Carregando..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);
