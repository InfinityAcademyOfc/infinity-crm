
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
    
    return data || [];
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar produto:', error);
      return null;
    }
    
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }
    
    return data;
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
    
    return data || [];
  },

  async getProductsWithLowStock(companyId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_service', false)
      .not('stock_quantity', 'is', null)
      .not('stock_minimum', 'is', null);
    
    if (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      return [];
    }
    
    // Filter products where stock_quantity <= stock_minimum
    const lowStockProducts = data?.filter(p => 
      p.stock_quantity !== null && 
      p.stock_minimum !== null && 
      p.stock_quantity <= p.stock_minimum
    ) || [];
    
    return lowStockProducts;
  }
};
