
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TeamSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TeamSearch: React.FC<TeamSearchProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="w-full sm:w-auto relative">
      <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
      <Input
        type="search"
        placeholder="Buscar membros..."
        className="w-full pl-10 pr-4 py-2"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
