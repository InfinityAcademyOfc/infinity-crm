
export interface SpreadsheetItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SheetItem {
  id: string;
  spreadsheetId: string;
  name: string;
  position: number;
}

export interface CellData {
  id?: string;
  value: string;
  formula?: string;
  format?: string;
  style?: Record<string, string>;
}

export type CellPosition = {
  row: number;
  col: number;
}

export interface SpreadsheetGridProps {
  data: CellData[][];
  onCellChange: (row: number, col: number, value: string) => void;
  onFormulaChange?: (row: number, col: number, formula: string) => void;
}
