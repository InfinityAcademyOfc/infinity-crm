
import { Search, X } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FilterMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FilterMenu = ({ open, onOpenChange }: FilterMenuProps) => {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Search size={16} />
          Filtrar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border-border">
        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Label htmlFor="search-leads" className="text-xs font-normal text-gray-500 dark:text-gray-400 mb-1">
            Pesquisar
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="search-leads"
              placeholder="Nome do lead..."
              className="pl-8 bg-background"
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-gray-500 dark:text-gray-400">
            Etiquetas
          </DropdownMenuLabel>
          <DropdownMenuItem className="gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/50"></div>
            ERP
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-100 dark:bg-purple-900/50"></div>
            Software
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/50"></div>
            Mobile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-gray-500 dark:text-gray-400">
            Responsável
          </DropdownMenuLabel>
          <DropdownMenuItem className="gap-2">
            <Avatar className="h-4 w-4">
              <AvatarImage src="/placeholder.svg" alt="Carlos" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
            Carlos Silva
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Avatar className="h-4 w-4">
              <AvatarImage src="/placeholder.svg" alt="Ana" />
              <AvatarFallback>AO</AvatarFallback>
            </Avatar>
            Ana Oliveira
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="p-2 flex gap-2">
          <Button className="flex-1">Aplicar</Button>
          <Button variant="outline" size="icon">
            <X size={16} />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
