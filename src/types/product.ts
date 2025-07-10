
export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  cost?: number;
  category?: string;
  stock?: number;
  stock_quantity?: number;
  stock_minimum?: number;
  sku?: string;
  is_service?: boolean;
  is_active?: boolean;
  tags?: string[];
  image_url?: string;
  company_id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
