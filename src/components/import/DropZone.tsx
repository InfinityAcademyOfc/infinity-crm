
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine } from "lucide-react";

interface DropZoneProps {
  icon: React.ReactNode;
  title: string;
  buttonText: string;
  supportedFormats: string;
  onClick: () => void;
}

const DropZone = ({ icon, title, buttonText, supportedFormats, onClick }: DropZoneProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center">
      {icon}
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <Button variant="outline" className="flex items-center gap-2 text-sm" size="sm" onClick={onClick}>
        <ArrowUpFromLine className="h-4 w-4" />
        <span>{buttonText}</span>
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        {supportedFormats}
      </p>
    </div>
  );
};

export default DropZone;
