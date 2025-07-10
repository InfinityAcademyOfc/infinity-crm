
-- Create funnel_stages table if not exists (for kanban columns)
CREATE TABLE IF NOT EXISTS public.funnel_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on funnel_stages
ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;

-- Create policies for funnel_stages
CREATE POLICY "Users can view company funnel stages" 
  ON public.funnel_stages 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company funnel stages" 
  ON public.funnel_stages 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Update sales_leads table to use stage from funnel_stages
ALTER TABLE public.sales_leads 
ADD COLUMN IF NOT EXISTS stage_id UUID REFERENCES public.funnel_stages(id);

-- Create lead_activities table for history tracking
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.sales_leads(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on lead_activities
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for lead_activities
CREATE POLICY "Users can view company lead activities" 
  ON public.lead_activities 
  FOR SELECT 
  USING (lead_id IN (
    SELECT id FROM public.sales_leads 
    WHERE company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can create lead activities" 
  ON public.lead_activities 
  FOR INSERT 
  WITH CHECK (lead_id IN (
    SELECT id FROM public.sales_leads 
    WHERE company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  ));

-- Enable RLS on sales_leads if not already enabled
ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for sales_leads
DROP POLICY IF EXISTS "Users can view company leads" ON public.sales_leads;
DROP POLICY IF EXISTS "Users can manage company leads" ON public.sales_leads;

CREATE POLICY "Users can view company leads" 
  ON public.sales_leads 
  FOR SELECT 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company leads" 
  ON public.sales_leads 
  FOR ALL 
  USING (company_id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Insert default funnel stages for existing companies
INSERT INTO public.funnel_stages (company_id, name, color, order_index)
SELECT DISTINCT company_id, 'Prospecção', '#ef4444', 0 FROM public.profiles WHERE company_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.funnel_stages (company_id, name, color, order_index)
SELECT DISTINCT company_id, 'Qualificação', '#f97316', 1 FROM public.profiles WHERE company_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.funnel_stages (company_id, name, color, order_index)
SELECT DISTINCT company_id, 'Proposta', '#eab308', 2 FROM public.profiles WHERE company_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.funnel_stages (company_id, name, color, order_index)
SELECT DISTINCT company_id, 'Negociação', '#3b82f6', 3 FROM public.profiles WHERE company_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.funnel_stages (company_id, name, color, order_index)
SELECT DISTINCT company_id, 'Ganhos', '#22c55e', 4 FROM public.profiles WHERE company_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Enable realtime for real-time updates
ALTER TABLE public.sales_leads REPLICA IDENTITY FULL;
ALTER TABLE public.funnel_stages REPLICA IDENTITY FULL;
ALTER TABLE public.lead_activities REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.funnel_stages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_activities;
