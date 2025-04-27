
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FilterMenuProps {
  onClose: () => void;
  onApply: () => void;
}

export function FilterMenu({ onClose, onApply }: FilterMenuProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [stage, setStage] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [origin, setOrigin] = useState<string | undefined>(undefined);

  const handleApplyFilters = () => {
    // Apply filters logic here
    onApply();
  };

  return (
    <Card className="p-4 absolute top-full right-0 mt-2 z-50 w-[300px] shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-sm">Filtrar Leads</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Período</label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PP") : "De"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PP") : "Até"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Etapa</label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as etapas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prospecting">Prospecção</SelectItem>
              <SelectItem value="qualification">Qualificação</SelectItem>
              <SelectItem value="proposal">Proposta</SelectItem>
              <SelectItem value="negotiation">Negociação</SelectItem>
              <SelectItem value="closed_won">Ganhos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Valor</label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Qualquer valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Até R$ 5.000</SelectItem>
              <SelectItem value="medium">R$ 5.000 - R$ 20.000</SelectItem>
              <SelectItem value="high">Acima de R$ 20.000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Origem</label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todas as origens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="social">Redes Sociais</SelectItem>
              <SelectItem value="referral">Indicação</SelectItem>
              <SelectItem value="ads">Anúncios</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="w-1/2" onClick={onClose}>
            Limpar
          </Button>
          <Button className="w-1/2" onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </Card>
  );
}
