
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save,
  FileDown,
  Calculator,
  Sigma,
  ChevronDown,
  FileText,
  BarChart2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SpreadsheetToolbar: React.FC = () => {
  return (
    <div className="border-b p-1 flex flex-wrap items-center gap-1">
      <div className="flex items-center mr-2">
        <Select defaultValue="Arial">
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Times">Times New Roman</SelectItem>
            <SelectItem value="Courier">Courier New</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="10">
          <SelectTrigger className="h-8 w-16 text-xs ml-1">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">8</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="18">18</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-0.5 border-l border-r px-1 mx-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-0.5 border-r px-1 mr-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs flex gap-1">
              <Calculator className="h-4 w-4" />
              Fórmulas
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Soma (=SUM)</DropdownMenuItem>
            <DropdownMenuItem>Média (=AVERAGE)</DropdownMenuItem>
            <DropdownMenuItem>Máximo (=MAX)</DropdownMenuItem>
            <DropdownMenuItem>Mínimo (=MIN)</DropdownMenuItem>
            <DropdownMenuItem>Contagem (=COUNT)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs flex gap-1">
              <BarChart2 className="h-4 w-4" />
              Gráficos
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Gráfico de Barras</DropdownMenuItem>
            <DropdownMenuItem>Gráfico de Linhas</DropdownMenuItem>
            <DropdownMenuItem>Gráfico de Pizza</DropdownMenuItem>
            <DropdownMenuItem>Gráfico de Área</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs flex gap-1">
              <FileText className="h-4 w-4" />
              Tabela
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Inserir Tabela</DropdownMenuItem>
            <DropdownMenuItem>Tabela Dinâmica</DropdownMenuItem>
            <DropdownMenuItem>Formatar Tabela</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Save className="h-3 w-3 mr-1" />
          Salvar
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <FileDown className="h-3 w-3 mr-1" />
          Exportar
        </Button>
      </div>
    </div>
  );
};

export default SpreadsheetToolbar;
