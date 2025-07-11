
-- Add manager_id column to profiles table for team hierarchy
ALTER TABLE public.profiles ADD COLUMN manager_id UUID REFERENCES public.profiles(id);

-- Create production_projects table
CREATE TABLE public.production_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_manager_id UUID REFERENCES public.profiles(id),
  team_members TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for production_projects
ALTER TABLE public.production_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for production_projects
CREATE POLICY "Users can view company projects" 
  ON public.production_projects 
  FOR SELECT 
  USING (company_id IN (
    SELECT profiles.company_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
    UNION
    SELECT profiles_companies.id 
    FROM profiles_companies 
    WHERE profiles_companies.id = auth.uid()
  ));

CREATE POLICY "Users can create company projects" 
  ON public.production_projects 
  FOR INSERT 
  WITH CHECK (company_id IN (
    SELECT profiles.company_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
    UNION
    SELECT profiles_companies.id 
    FROM profiles_companies 
    WHERE profiles_companies.id = auth.uid()
  ));

CREATE POLICY "Users can update company projects" 
  ON public.production_projects 
  FOR UPDATE 
  USING (company_id IN (
    SELECT profiles.company_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
    UNION
    SELECT profiles_companies.id 
    FROM profiles_companies 
    WHERE profiles_companies.id = auth.uid()
  ));

CREATE POLICY "Users can delete company projects" 
  ON public.production_projects 
  FOR DELETE 
  USING (company_id IN (
    SELECT profiles.company_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
    UNION
    SELECT profiles_companies.id 
    FROM profiles_companies 
    WHERE profiles_companies.id = auth.uid()
  ));

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_production_projects_updated_at
  BEFORE UPDATE ON public.production_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
