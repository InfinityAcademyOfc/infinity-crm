import React, { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash, ChevronDown, Bold, Italic, AlignLeft, AlignCenter, AlignRight, UnderlineIcon } from "lucide-react";
import { SpreadsheetSheet } from "../document-explorer/types";
import SpreadsheetToolbar from "./SpreadsheetToolbar";

interface SpreadsheetContentProps {
  data: any[][];
  sheetName: string;
  sheets: SpreadsheetSheet[];
  activeSheetId: string;
  onDataChange: (data: any[][]) => void;
  onAddSheet: () => void;
  onRenameSheet: (sheetId: string, name: string) => void;
  onDeleteSheet: (sheetId: string) => void;
  onSelectSheet: (sheetId: string) => void;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({
  data,
  sheetName,
  sheets,
  activeSheetId,
  onDataChange,
  onAddSheet,
  onRenameSheet,
  onDeleteSheet,
  onSelectSheet,
}) => {
  const [editCell, setEditCell] = useState<{ row: number, col: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [renamingSheet, setRenamingSheet] = useState<string | null>(null);
  const [newSheetName, setNewSheetName] = useState("");
  const [selectedCells, setSelectedCells] = useState<{ startRow: number, startCol: number, endRow: number, endCol: number } | null>(null);
  const [formulaInput, setFormulaInput] = useState<string>("");
  const tableRef = useRef<HTMLTableElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ensureDataSize = (rows: number, cols: number) => {
    const newData = [...data];
    while (newData.length < rows) {
      newData.push(Array(newData[0]?.length || cols).fill(""));
    }
    for (let i = 0; i < newData.length; i++) {
      while ((newData[i]?.length || 0) < cols) {
        newData[i].push("");
      }
    }
    return newData;
  };

  const expandedData = ensureDataSize(100, 26);

  const handleCellClick = (row: number, col: number) => {
    if (editCell && editCell.row === row && editCell.col === col) return;
    setSelectedCells({ startRow: row, startCol: col, endRow: row, endCol: col });
  };

  const handleCellDoubleClick = (row: number, col: number) => {
    setEditCell({ row, col });
    setEditValue(expandedData[row][col]?.toString() || "");
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleCellChange = () => {
    if (editCell) {
      const newData = [...expandedData];
      newData[editCell.row][editCell.col] = editValue;
      onDataChange(newData);
      setEditCell(null);
    }
  };

  const handleFormula = (e: React.FormEvent) => {
    e.preventDefault();
    const match = formulaInput.match(/^=SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/i);
    if (match) {
      const col1 = match[1].charCodeAt(0) - 65;
      const row1 = Number(match[2]) - 1;
      const col2 = match[3].charCodeAt(0) - 65;
      const row2 = Number(match[4]) - 1;
      let sum = 0;
      for (let r = row1; r <= row2; r++) {
        for (let c = col1; c <= col2; c++) {
          sum += Number(expandedData[r][c] || 0);
        }
      }
      if (selectedCells) {
        const newData = [...expandedData];
        newData[selectedCells.startRow][selectedCells.startCol] = sum;
        onDataChange(newData);
        setFormulaInput("");
        setSelectedCells(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCellChange();
    else if (e.key === "Escape") setEditCell(null);
    else if (e.key === "Tab") {
      e.preventDefault();
      handleCellChange();
      if (editCell && editCell.col < expandedData[0].length - 1)
        handleCellDoubleClick(editCell.row, editCell.col + 1);
    }
  };

  const colLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  const handleRenameSheet = () => {
    if (renamingSheet && newSheetName.trim()) {
      onRenameSheet(renamingSheet, newSheetName.trim());
      setRenamingSheet(null);
      setNewSheetName("");
    } else {
      setRenamingSheet(null);
      setNewSheetName("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <SpreadsheetToolbar />
      <div className="flex flex-col h-full">
        <form onSubmit={handleFormula} className="mb-2 flex items-center gap-2">
          <input 
            value={formulaInput}
            onChange={e => setFormulaInput(e.target.value)}
            placeholder="Digite fórmula (ex: =SUM(A1:B2))"
            className="p-1 border rounded text-xs"
            style={{width: 180}}
          />
          <Button size="sm" type="submit" variant="secondary">Aplicar</Button>
        </form>
        <div className="border-t flex items-center">
          <ScrollArea className="flex-1 overflow-x-auto whitespace-nowrap">
            {sheets.map((sheet) => (
              <React.Fragment key={sheet.id}>
                {renamingSheet === sheet.id ? (
                  <div className="inline-flex items-center ml-1">
                    <Input
                      value={newSheetName}
                      onChange={(e) => setNewSheetName(e.target.value)}
                      className="h-6 w-24 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSheet();
                        if (e.key === 'Escape') {
                          setRenamingSheet(null);
                          setNewSheetName("");
                        }
                      }}
                      onBlur={handleRenameSheet}
                      autoFocus
                    />
                  </div>
                ) : (
                  <Button
                    variant={sheet.id === activeSheetId ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-2 rounded-none rounded-t-md text-xs relative"
                    onClick={() => onSelectSheet(sheet.id)}
                  >
                    {sheet.name}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 opacity-50 hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingSheet(sheet.id);
                            setNewSheetName(sheet.name);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        {sheets.length > 1 && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSheet(sheet.id);
                            }}
                            className="text-red-500"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Button>
                )}
              </React.Fragment>
            ))}
          </ScrollArea>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onAddSheet}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto border-t relative">
          <div className="min-w-[800px]">
            <table ref={tableRef} className="spreadsheet-table w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border bg-muted/50 w-10 h-8"></th>
                  {colLetters.map((letter, index) => (
                    <th key={letter} className="border border-border bg-muted/50 w-20 text-center h-8">{letter}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 100 }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-border bg-muted/50 text-center font-medium">
                      {rowIndex + 1}
                    </td>
                    {Array.from({ length: 26 }).map((_, colIndex) => {
                      const selected = selectedCells && rowIndex >= selectedCells.startRow && rowIndex <= selectedCells.endRow && colIndex >= selectedCells.startCol && colIndex <= selectedCells.endCol;
                      return (
                        <td
                          key={colIndex}
                          className={`border border-border h-6 relative p-0 ${selected ? "bg-blue-200/60" : ""}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                        >
                          {editCell?.row === rowIndex && editCell?.col === colIndex ? (
                            <input
                              ref={inputRef}
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onBlur={handleCellChange}
                              onKeyDown={handleKeyDown}
                              className="h-full border-0 rounded-none focus:ring-0 p-1 text-xs"
                              style={{minWidth:50}}
                              autoFocus
                            />
                          ) : (
                            <div className="h-full p-1 overflow-hidden whitespace-nowrap text-ellipsis text-xs">
                              {expandedData[rowIndex][colIndex]}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetContent;
