
export interface DocumentItem {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: DocumentItem[];
  expanded?: boolean;
  sheets?: SpreadsheetSheet[];
  folderColor?: string; // Added folderColor property
}

export interface SpreadsheetSheet {
  id: string;
  name: string;
  data: any[][];
  activeCell?: { row: number, col: number };
}
