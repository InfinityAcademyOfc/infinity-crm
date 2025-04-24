
export interface DocumentItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: DocumentItem[];
  expanded?: boolean;
  sheets?: SpreadsheetSheet[];
}

export interface SpreadsheetSheet {
  id: string;
  name: string;
  data: any[][];
  activeCell?: { row: number, col: number };
}
