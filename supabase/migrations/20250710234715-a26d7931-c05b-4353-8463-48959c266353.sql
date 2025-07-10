
-- FASE 6: Sistema de Equipe Avançado
-- Criar tabela para projetos de produção
CREATE TABLE IF NOT EXISTS public.production_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  end_date DATE,
  budget NUMERIC(12,2),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_manager_id UUID,
  team_members UUID[] DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar colunas faltantes na tabela profiles para hierarquia
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS manager_id UUID,
ADD COLUMN IF NOT EXISTS hire_date DATE,
ADD COLUMN IF NOT EXISTS salary NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS team TEXT;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON public.profiles(manager_id);
CREATE INDEX IF NOT EXISTS idx_profiles_company_department ON public.profiles(company_id, department);
CREATE INDEX IF NOT EXISTS idx_production_projects_company ON public.production_projects(company_id);
CREATE INDEX IF NOT EXISTS idx_production_projects_manager ON public.production_projects(project_manager_id);

-- RLS para production_projects
ALTER TABLE public.production_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company production projects" ON public.production_projects
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM profiles_companies WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create company production projects" ON public.production_projects
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM profiles_companies WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update company production projects" ON public.production_projects
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM profiles_companies WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete company production projects" ON public.production_projects
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM profiles_companies WHERE id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE TRIGGER update_production_projects_updated_at
  BEFORE UPDATE ON public.production_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Função para buscar hierarquia da equipe
CREATE OR REPLACE FUNCTION public.get_team_hierarchy(company_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  role TEXT,
  department TEXT,
  position TEXT,
  manager_id UUID,
  manager_name TEXT,
  level INTEGER
) 
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  WITH RECURSIVE team_hierarchy AS (
    -- Nível raiz (sem manager)
    SELECT 
      p.id,
      p.name,
      p.email,
      p.role,
      p.department,
      p.position,
      p.manager_id,
      NULL::TEXT as manager_name,
      0 as level
    FROM profiles p
    WHERE p.company_id = company_uuid AND p.manager_id IS NULL
    
    UNION ALL
    
    -- Níveis subsequentes
    SELECT 
      p.id,
      p.name,
      p.email,
      p.role,
      p.department,
      p.position,
      p.manager_id,
      th.name as manager_name,
      th.level + 1
    FROM profiles p
    JOIN team_hierarchy th ON p.manager_id = th.id
    WHERE p.company_id = company_uuid
  )
  SELECT * FROM team_hierarchy ORDER BY level, name;
$$;
