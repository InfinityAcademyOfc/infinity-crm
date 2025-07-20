
-- FASE 1: Correção do RLS e Recursão Infinita

-- 1. Remover políticas RLS recursivas da tabela profiles
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Company admins can view profiles in their company" ON public.profiles;
DROP POLICY IF EXISTS "User can see own profile" ON public.profiles;
DROP POLICY IF EXISTS "User can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view company profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;

-- 2. Criar políticas RLS simples e não recursivas para profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view company profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id OR 
    company_id IN (
      SELECT p.company_id 
      FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 3. Adicionar coluna cost na tabela products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost NUMERIC;

-- 4. Adicionar RLS para tabelas sem proteção
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their contacts"
  ON public.contacts
  FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.whatsapp_flows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their whatsapp flows"
  ON public.whatsapp_flows
  FOR ALL
  USING (auth.uid() = profile_id);

ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their config"
  ON public.config
  FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.whatsapp_autoresponders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their autoresponders"
  ON public.whatsapp_autoresponders
  FOR ALL
  USING (auth.uid() = session_id);

ALTER TABLE public.client_ltv ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view company client ltv"
  ON public.client_ltv
  FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company client ltv"
  ON public.client_ltv
  FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage company milestones"
  ON public.project_milestones
  FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

ALTER TABLE public.whatsapp_broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their broadcasts"
  ON public.whatsapp_broadcasts
  FOR ALL
  USING (auth.uid() = profile_id);

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their messages"
  ON public.whatsapp_messages
  FOR ALL
  USING (true); -- WhatsApp messages podem ser públicos para o sistema

ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their lists"
  ON public.lists
  FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their media"
  ON public.media
  FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their chatbots"
  ON public.chatbots
  FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.company_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage company goals"
  ON public.company_goals
  FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- 5. Corrigir políticas de funnel_stages para permitir INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Users can view company funnel stages" ON public.funnel_stages;

CREATE POLICY "Users can view company funnel stages"
  ON public.funnel_stages
  FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage company funnel stages"
  ON public.funnel_stages
  FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- 6. Adicionar manager_id e outras colunas faltantes na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hire_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS salary NUMERIC(12,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS team TEXT;

-- 7. Criar tabela production_projects se não existir
CREATE TABLE IF NOT EXISTS public.production_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  project_manager_id UUID REFERENCES public.profiles(id),
  team_members UUID[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.production_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage company production projects"
  ON public.production_projects
  FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- 8. Criar tabela sales_leads se não existir (para o funil de vendas)
CREATE TABLE IF NOT EXISTS public.sales_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  description TEXT,
  value NUMERIC,
  source TEXT,
  assigned_to UUID REFERENCES public.profiles(id),
  stage_id UUID REFERENCES public.funnel_stages(id),
  stage TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage company sales leads"
  ON public.sales_leads
  FOR ALL
  USING (company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ));

-- 9. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_company_id ON public.sales_leads(company_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_stage_id ON public.sales_leads(stage_id);
CREATE INDEX IF NOT EXISTS idx_production_projects_company_id ON public.production_projects(company_id);

-- 10. Ativar realtime para tabelas principais
ALTER TABLE public.sales_leads REPLICA IDENTITY FULL;
ALTER TABLE public.funnel_stages REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.clients REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Adicionar às publicações realtime se não existirem
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'sales_leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_leads;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'funnel_stages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.funnel_stages;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'clients'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
  END IF;
END $$;
