
import React, { useState, useRef, useCallback } from 'react';
import { SpreadsheetGridProps, CellPosition } from './types';

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({ 
  data, 
  onCellChange 
}) => {
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[][]>([]);

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
        className={`
          border h-8 min-w-[100px] px-2 py-1 
          ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isEditing ? 'outline outline-2 outline-blue-500' : ''}
        `}
        onClick={() => handleCellClick(row, col)}
        onDoubleClick={() => handleCellDoubleClick(row, col)}
      >
        {isEditing ? (
          <input
            type="text"
            autoFocus
            defaultValue={cellData.value}
            className="w-full h-full outline-none"
            onBlur={(e) => handleCellBlur(row, col, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellBlur(row, col, e.currentTarget.value);
              }
            }}
          />
        ) : (
          <span>{cellData.value}</span>
        )}
      </div>
    );
  }, [data, activeCell, editingCell, handleCellClick, handleCellDoubleClick, handleCellBlur]);

  // Generate grid rows and columns
  const gridRows = Array.from({ length: 20 }, (_, rowIndex) => (
    <div key={`row-${rowIndex}`} className="flex">
      {Array.from({ length: 20 }, (_, colIndex) => renderCell(rowIndex, colIndex))}
    </div>
  ));

  return (
    <div className="overflow-auto">
      <div className="inline-block border-collapse">
        {gridRows}
      </div>
    </div>
  );
};
