
-- FASE 4: CLIENTES - Enhance clients table and related functionality
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS segment TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update client_ltv table structure
ALTER TABLE public.client_ltv 
ADD COLUMN IF NOT EXISTS average_order_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS churn_probability NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Enable RLS on client_ltv
ALTER TABLE public.client_ltv ENABLE ROW LEVEL SECURITY;

-- Create policies for client_ltv
CREATE POLICY "Users can view company client ltv" 
  ON public.client_ltv 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company client ltv" 
  ON public.client_ltv 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Enable RLS on client_nps
ALTER TABLE public.client_nps ENABLE ROW LEVEL SECURITY;

-- Create policies for client_nps
CREATE POLICY "Users can view company client nps" 
  ON public.client_nps 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company client nps" 
  ON public.client_nps 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Enable RLS on client_satisfaction
ALTER TABLE public.client_satisfaction ENABLE ROW LEVEL SECURITY;

-- Create policies for client_satisfaction
CREATE POLICY "Users can view company client satisfaction" 
  ON public.client_satisfaction 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company client satisfaction" 
  ON public.client_satisfaction 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- FASE 5: PRODUTOS/SERVIÇOS - Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  cost NUMERIC,
  category TEXT,
  sku TEXT,
  stock_quantity INTEGER DEFAULT 0,
  stock_minimum INTEGER DEFAULT 0,
  is_service BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Users can view company products" 
  ON public.products 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company products" 
  ON public.products 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Create sales_items table to link products with sales
CREATE TABLE IF NOT EXISTS public.sales_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.sales_leads(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  discount_percent NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sales_items
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_items
CREATE POLICY "Users can view company sales items" 
  ON public.sales_items 
  FOR SELECT 
  USING (lead_id IN (
    SELECT id FROM public.sales_leads 
    WHERE company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage company sales items" 
  ON public.sales_items 
  FOR ALL 
  USING (lead_id IN (
    SELECT id FROM public.sales_leads 
    WHERE company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  ));

-- Create product_categories table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on product_categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for product_categories
CREATE POLICY "Users can view company product categories" 
  ON public.product_categories 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company product categories" 
  ON public.product_categories 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Enable realtime for new tables
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.sales_items REPLICA IDENTITY FULL;
ALTER TABLE public.product_categories REPLICA IDENTITY FULL;
ALTER TABLE public.client_ltv REPLICA IDENTITY FULL;
ALTER TABLE public.client_nps REPLICA IDENTITY FULL;
ALTER TABLE public.client_satisfaction REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_ltv;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_nps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_satisfaction;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at 
  BEFORE UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
