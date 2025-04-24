
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FileUploadFieldProps {
  id: string;
  label: string;
  acceptedFormats: string;
  formatDescription: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadField = ({ 
  id, 
  label, 
  acceptedFormats, 
  formatDescription, 
  onChange 
}: FileUploadFieldProps) => {
  return (
    <div>
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        type="file"
        accept={acceptedFormats}
        onChange={onChange}
        className="cursor-pointer"
      />
      <p className="text-xs text-muted-foreground mt-2">
        {formatDescription}
      </p>
    </div>
  );
};

export default FileUploadField;
