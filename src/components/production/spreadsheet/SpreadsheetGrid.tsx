
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SpreadsheetGridProps, CellPosition } from './types';
import { cn } from '@/lib/utils';

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({ 
  data, 
  onCellChange 
}) => {
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerSize = 36; // Size of headers in pixels

  // Calculate visible rows and columns based on container size
  const [visibleRows, setVisibleRows] = useState(20);
  const [visibleCols, setVisibleCols] = useState(20);

  useEffect(() => {
    const updateVisibleCells = () => {
      if (gridRef.current) {
        const gridHeight = gridRef.current.clientHeight - headerSize;
        const gridWidth = gridRef.current.clientWidth - headerSize;
        setVisibleRows(Math.max(20, Math.floor(gridHeight / 36)));
        setVisibleCols(Math.max(20, Math.floor(gridWidth / 100)));
      }
    };

    updateVisibleCells();
    window.addEventListener('resize', updateVisibleCells);
    return () => window.removeEventListener('resize', updateVisibleCells);
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    setActiveCell({ row, col });
  }, []);

  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    setEditingCell({ row, col });
  }, []);

  const handleCellBlur = useCallback((row: number, col: number, value: string) => {
    onCellChange(row, col, value);
    setEditingCell(null);
  }, [onCellChange]);

  const handleCellKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number, value: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCellChange(row, col, value);
      setEditingCell(null);
      
      // Move to next row after Enter
      setActiveCell(prev => prev ? { row: prev.row + 1, col: prev.col } : null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onCellChange(row, col, value);
      setEditingCell(null);
      
      // Move to next column after Tab
      setActiveCell(prev => prev ? { row: prev.row, col: prev.col + 1 } : null);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  }, [onCellChange]);

  const renderColumnHeaders = useCallback(() => {
    return (
      <div className="flex sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
        {/* Corner cell */}
        <div className="min-w-[36px] w-9 h-9 flex items-center justify-center border-r border-b border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Column headers A, B, C, etc. */}
        {Array.from({ length: visibleCols }, (_, i) => {
          const colLabel = String.fromCharCode(65 + i); // A=65, B=66, etc.
          return (
            <div 
              key={`col-header-${i}`} 
              className="min-w-[100px] w-[100px] h-9 flex items-center justify-center border-r border-b border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 font-medium text-sm"
            >
              {colLabel}
            </div>
          );
        })}
      </div>
    );
  }, [visibleCols]);

  const renderCell = useCallback((row: number, col: number) => {
    const cellData = data[row]?.[col] || { value: '' };
    const isActive = activeCell?.row === row && activeCell?.col === col;
    const isEditing = editingCell?.row === row && editingCell?.col === col;

    return (
      <div 
        key={`cell-${row}-${col}`}
        ref={(el) => {
          if (!cellRefs.current[row]) cellRefs.current[row] = [];
          cellRefs.current[row][col] = el;
        }}
        className={cn(
          "border h-9 min-w-[100px] w-[100px] px-2 py-1 overflow-hidden whitespace-nowrap text-sm",
          isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700',
          isEditing ? 'outline outline-2 outline-blue-500' : ''
        )}
        onClick={() => handleCellClick(row, col)}
        onDoubleClick={() => handleCellDoubleClick(row, col)}
      >
        {isEditing ? (
          <input
            type="text"
            autoFocus
            defaultValue={cellData.value}
            className="w-full h-full outline-none bg-transparent"
            onBlur={(e) => handleCellBlur(row, col, e.target.value)}
            onKeyDown={(e) => handleCellKeyDown(e, row, col, e.currentTarget.value)}
          />
        ) : (
          <span>{cellData.value}</span>
        )}
      </div>
    );
  }, [data, activeCell, editingCell, handleCellClick, handleCellDoubleClick, handleCellBlur, handleCellKeyDown]);

  // Generate grid rows and columns with row headers (1, 2, 3, etc.)
  const gridRows = Array.from({ length: visibleRows }, (_, rowIndex) => (
    <div key={`row-${rowIndex}`} className="flex">
      {/* Row header */}
      <div className="min-w-[36px] w-9 h-9 flex items-center justify-center border-r border-b border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 sticky left-0 z-10 font-medium text-sm">
        {rowIndex + 1}
      </div>
      
      {/* Row cells */}
      {Array.from({ length: visibleCols }, (_, colIndex) => renderCell(rowIndex, colIndex))}
    </div>
  ));

  return (
    <div className="w-full h-full overflow-auto" ref={gridRef}>
      <div className="inline-block border-collapse">
        {renderColumnHeaders()}
        {gridRows}
      </div>
    </div>
  );
};
