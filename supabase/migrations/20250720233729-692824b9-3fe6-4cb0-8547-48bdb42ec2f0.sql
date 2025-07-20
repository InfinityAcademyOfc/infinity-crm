
-- Add missing columns to the products table to match the Product interface
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cost numeric,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS is_service boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS created_by uuid,
ADD COLUMN IF NOT EXISTS stock_minimum integer DEFAULT 0;

-- Rename stock column to stock_quantity for consistency
ALTER TABLE public.products 
RENAME COLUMN stock TO stock_quantity;

-- Add updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
