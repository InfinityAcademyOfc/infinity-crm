
import React, { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

const SpreadsheetToolbar: React.FC = () => {
  const { toast } = useToast();
  const [activeFormat, setActiveFormat] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
    alignJustify: false
  });
  
  const [fontSize, setFontSize] = useState("10");
  const [fontFamily, setFontFamily] = useState("Arial");
  
  const toggleFormat = (format: string) => {
    // For alignment, we need to make it exclusive
    if (['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'].includes(format)) {
      setActiveFormat(prev => {
        const newFormat = { ...prev };
        // Turn off all alignment formats
        newFormat.alignLeft = false;
        newFormat.alignCenter = false;
        newFormat.alignRight = false;
        newFormat.alignJustify = false;
        // Turn on the selected one
        newFormat[format] = true;
        return newFormat;
      });
    } else {
      // Toggle other formats
      setActiveFormat(prev => ({
        ...prev,
        [format]: !prev[format]
      }));
    }
    
    toast({
      description: "Formato aplicado às células selecionadas",
      duration: 2000
    });
  };
  
  const applyFormula = (formula: string) => {
    toast({
      description: `Fórmula ${formula} inserida`,
      duration: 2000
    });
  };
  
  const insertChart = (chartType: string) => {
    toast({
      description: `Gráfico ${chartType} inserido`,
      duration: 2000
    });
  };
  
  const saveSpreadsheet = () => {
    toast({
      description: "Planilha salva com sucesso",
      duration: 2000
    });
  };
  
  const exportSpreadsheet = () => {
    toast({
      description: "Exportando planilha...",
      duration: 2000
    });
  };

  return (
    <div className="border-b p-1 flex flex-wrap items-center gap-1">
      <div className="flex items-center mr-2">
        <Select value={fontFamily} onValueChange={setFontFamily}>
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
        
        <Select value={fontSize} onValueChange={setFontSize}>
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
        <Button 
          variant={activeFormat.bold ? "default" : "ghost"} 
          size="icon" 
          className="h-8 w-8"
          onClick={() => toggleFormat('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormat.italic ? "default" : "ghost"} 
          size="icon" 
          className="h-8 w-8"
          onClick={() => toggleFormat('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormat.underline ? "default" : "ghost"} 
          size="icon" 
          className="h-8 w-8"
          onClick={() => toggleFormat('underline')}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-0.5 border-r px-1 mr-1">
        <Button 
          variant={activeFormat.alignLeft ? "default" : "ghost"} 
          size="icon" 
          className="h-8 w-8"
          onClick={() => toggleFormat('alignLeft')}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormat.alignCenter ? "default" : "ghost"} 
          size="icon" 
          className="h-8 w-8"
          onClick={() => toggleFormat('alignCenter')}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormat.alignRight ? "default" : "ghost"} 
          size="icon" 
          className="h-8 w-8"
          onClick={() => toggleFormat('alignRight')}
        >
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
            <DropdownMenuItem onClick={() => applyFormula("SUM")}>Soma (=SUM)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormula("AVERAGE")}>Média (=AVERAGE)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormula("MAX")}>Máximo (=MAX)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormula("MIN")}>Mínimo (=MIN)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => applyFormula("COUNT")}>Contagem (=COUNT)</DropdownMenuItem>
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
            <DropdownMenuItem onClick={() => insertChart("Barras")}>Gráfico de Barras</DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertChart("Linhas")}>Gráfico de Linhas</DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertChart("Pizza")}>Gráfico de Pizza</DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertChart("Área")}>Gráfico de Área</DropdownMenuItem>
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
            <DropdownMenuItem onClick={() => toast({ description: "Tabela inserida" })}>Inserir Tabela</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ description: "Tabela dinâmica inserida" })}>Tabela Dinâmica</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({ description: "Formatação aplicada" })}>Formatar Tabela</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={saveSpreadsheet}>
          <Save className="h-3 w-3 mr-1" />
          Salvar
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={exportSpreadsheet}>
          <FileDown className="h-3 w-3 mr-1" />
          Exportar
        </Button>
      </div>
    </div>
  );
};

export default SpreadsheetToolbar;
