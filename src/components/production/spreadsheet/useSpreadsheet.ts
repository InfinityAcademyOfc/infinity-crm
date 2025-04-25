
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CellData, SpreadsheetItem, SheetItem } from './types';

export const useSpreadsheet = () => {
  const [spreadsheets, setSpreadsheets] = useState<SpreadsheetItem[]>([]);
  const [currentSpreadsheet, setCurrentSpreadsheet] = useState<SpreadsheetItem | null>(null);
  const [currentSheet, setCurrentSheet] = useState<SheetItem | null>(null);
  const [gridData, setGridData] = useState<CellData[][]>([]);

  const createSpreadsheet = useCallback(async (name: string = 'Nova Planilha') => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      return null;
    }

    const { data, error } = await supabase
      .from('production_spreadsheets')
      .insert({ 
        name,
        user_id: userData.user.id 
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating spreadsheet:', error);
      return null;
    }

    // Automatically create first sheet
    const { data: sheetData, error: sheetError } = await supabase
      .from('production_sheets')
      .insert({ 
        spreadsheet_id: data.id, 
        name: 'Sheet 1' 
      })
      .select()
      .single();

    if (sheetError) {
      console.error('Error creating first sheet:', sheetError);
      return null;
    }

    return mapDatabaseSpreadsheetToItem(data);
  }, []);

  const fetchSpreadsheets = useCallback(async () => {
    const { data, error } = await supabase
      .from('production_spreadsheets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching spreadsheets:', error);
      return;
    }

    setSpreadsheets(data.map(mapDatabaseSpreadsheetToItem));
  }, []);

  const loadSpreadsheetData = useCallback(async (spreadsheetId: string) => {
    // Fetch spreadsheet details
    const { data: spreadsheetData, error: spreadsheetError } = await supabase
      .from('production_spreadsheets')
      .select('*')
      .eq('id', spreadsheetId)
      .single();

    if (spreadsheetError) {
      console.error('Error loading spreadsheet:', spreadsheetError);
      return;
    }

    // Fetch sheets for this spreadsheet
    const { data: sheetsData, error: sheetsError } = await supabase
      .from('production_sheets')
      .select('*')
      .eq('spreadsheet_id', spreadsheetId)
      .order('position');

    if (sheetsError) {
      console.error('Error loading sheets:', sheetsError);
      return;
    }

    // Fetch cells for the first sheet
    if (sheetsData.length > 0) {
      const firstSheet = sheetsData[0];
      const { data: cellsData, error: cellsError } = await supabase
        .from('production_cells')
        .select('*')
        .eq('sheet_id', firstSheet.id);

      if (cellsError) {
        console.error('Error loading cells:', cellsError);
        return;
      }

      // Transform cells into 2D grid
      const grid: CellData[][] = [];
      cellsData.forEach(cell => {
        while (grid.length <= cell.row_index) {
          grid.push([]);
        }
        grid[cell.row_index][cell.col_index] = {
          id: cell.id,
          value: cell.value || '',
          formula: cell.formula || '',
          format: cell.format,
          style: cell.style ? JSON.parse(JSON.stringify(cell.style)) : undefined
        };
      });

      setCurrentSpreadsheet(mapDatabaseSpreadsheetToItem(spreadsheetData));
      setCurrentSheet(mapDatabaseSheetToItem(firstSheet));
      setGridData(grid);
    }
  }, []);

  const updateCellData = useCallback(async (
    sheetId: string, 
    row: number, 
    col: number, 
    cellData: Partial<CellData>
  ) => {
    const { data, error } = await supabase
      .from('production_cells')
      .upsert({
        sheet_id: sheetId,
        row_index: row,
        col_index: col,
        value: cellData.value,
        formula: cellData.formula,
        format: cellData.format,
        style: cellData.style ? cellData.style : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating cell:', error);
    }

    return data;
  }, []);

  // Helper function to map database response to our types
  const mapDatabaseSpreadsheetToItem = (data: any): SpreadsheetItem => ({
    id: data.id,
    name: data.name,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  });

  // Helper function to map database sheet to our types
  const mapDatabaseSheetToItem = (data: any): SheetItem => ({
    id: data.id,
    spreadsheetId: data.spreadsheet_id,
    name: data.name,
    position: data.position
  });

  return {
    spreadsheets,
    currentSpreadsheet,
    currentSheet,
    gridData,
    createSpreadsheet,
    fetchSpreadsheets,
    loadSpreadsheetData,
    updateCellData,
    setGridData
  };
};
