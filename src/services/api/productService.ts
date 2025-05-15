
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";

export const productService = {
  async getProducts(companyId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', companyId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar produtos");
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      toast.error("Erro ao carregar dados do produto");
      return null;
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Produto criado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Erro ao criar produto");
      return null;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      toast.success("Produto atualizado com sucesso");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Erro ao atualizar produto");
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Produto removido com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao remover produto");
      return false;
    }
  }
};
