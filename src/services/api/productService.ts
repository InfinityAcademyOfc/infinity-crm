
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  price?: number;
  cost?: number;
  category?: string;
  stock_quantity?: number;
  stock_minimum?: number;
  sku?: string;
  is_service?: boolean;
  is_active?: boolean;
  tags?: string[];
  image_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const productService = {
  async getProducts(companyId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      stock_quantity: (item as any).stock || 0,
      stock_minimum: 0
    } as Product));
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { stock_quantity, stock_minimum, ...dbData } = product;
    const productToInsert = {
      ...dbData,
      stock: stock_quantity || 0
    };

    const { data, error } = await supabase
      .from('products')
      .insert(productToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar produto:', error);
      return null;
    }
    
    return {
      ...data,
      stock_quantity: (data as any).stock || 0,
      stock_minimum: 0
    } as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { stock_quantity, stock_minimum, ...dbUpdates } = updates;
    const updateData = {
      ...dbUpdates,
      ...(stock_quantity !== undefined && { stock: stock_quantity }),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
    
    return {
      ...data,
      stock_quantity: (data as any).stock || 0,
      stock_minimum: 0
    } as Product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }
    
    return true;
  },

  async getProductCategories(companyId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('company_id', companyId)
      .not('category', 'is', null);
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
    
    const categories = [...new Set(data?.map(p => p.category).filter(Boolean))];
    return categories as string[];
  },

  async getProductsByCategory(companyId: string, category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .eq('category', category)
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      stock_quantity: (item as any).stock || 0,
      stock_minimum: 0
    } as Product));
  },

  async getProductsWithLowStock(companyId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_service', false)
      .not('stock', 'is', null);
    
    if (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      return [];
    }
    
    // Transform the data first, then filter to avoid deep type instantiation
    const transformedProducts: Product[] = (data || []).map(item => ({
      ...item,
      stock_quantity: (item as any).stock || 0,
      stock_minimum: 0
    } as Product));
    
    // Simple filter with explicit types to avoid infinite recursion
    const lowStockProducts: Product[] = [];
    for (const product of transformedProducts) {
      const stockQty = product.stock_quantity;
      if (typeof stockQty === 'number' && stockQty <= 5) {
        lowStockProducts.push(product);
      }
    }
    
    return lowStockProducts;
  }
};
