-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  date_sent TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'rejected')),
  version INTEGER NOT NULL DEFAULT 1,
  value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  slug TEXT UNIQUE NOT NULL,
  content_json JSONB,
  created_by UUID REFERENCES public.users(id)
);

-- Proposal versions table
CREATE TABLE IF NOT EXISTS public.proposal_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  changes TEXT,
  content_snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.users(id),
  UNIQUE(proposal_id, version_number)
);

-- AI chat history table
CREATE TABLE IF NOT EXISTS public.ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_client_id ON public.proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_slug ON public.proposals(slug);
CREATE INDEX IF NOT EXISTS idx_proposal_versions_proposal_id ON public.proposal_versions(proposal_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_proposal_id ON public.ai_chat_history(proposal_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for proposals updated_at
DROP TRIGGER IF EXISTS update_proposals_updated_at ON public.proposals;
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Admins and editors can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can view proposals" ON public.proposals;
DROP POLICY IF EXISTS "Admins and editors can manage proposals" ON public.proposals;
DROP POLICY IF EXISTS "Authenticated users can view proposal versions" ON public.proposal_versions;
DROP POLICY IF EXISTS "Users can manage own chat history" ON public.ai_chat_history;

-- Create system user function
CREATE OR REPLACE FUNCTION create_system_user_if_not_exists()
RETURNS UUID AS $$
DECLARE
    system_user_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Check if system user exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = system_user_id) THEN
        -- Create system user
        INSERT INTO public.users (id, email, name, role, created_at)
        VALUES (
            system_user_id,
            'system@alma2026.com',
            'Sistema ALMA 2026',
            'admin',
            NOW()
        );
    END IF;
    
    RETURN system_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert themselves" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow service role to manage users
CREATE POLICY "Service role can manage users" ON public.users
  FOR ALL USING (current_setting('role') = 'service_role');

-- Clients policies
CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and editors can manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Allow service role to manage clients
CREATE POLICY "Service role can manage clients" ON public.clients
  FOR ALL USING (current_setting('role') = 'service_role');

-- Proposals policies
CREATE POLICY "Public can view proposals" ON public.proposals
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can manage proposals" ON public.proposals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Allow service role to manage proposals
CREATE POLICY "Service role can manage proposals" ON public.proposals
  FOR ALL USING (current_setting('role') = 'service_role');

-- Allow system operations for proposals
CREATE POLICY "System can manage proposals" ON public.proposals
  FOR ALL USING (
    created_by = '00000000-0000-0000-0000-000000000001' OR
    created_by IS NULL
  );

-- Proposal versions policies
CREATE POLICY "Public can view proposal versions" ON public.proposal_versions
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can manage proposal versions" ON public.proposal_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Allow service role to manage proposal versions
CREATE POLICY "Service role can manage proposal versions" ON public.proposal_versions
  FOR ALL USING (current_setting('role') = 'service_role');

-- AI chat history policies
CREATE POLICY "Users can manage own chat history" ON public.ai_chat_history
  FOR ALL USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow service role to manage chat history
CREATE POLICY "Service role can manage chat history" ON public.ai_chat_history
  FOR ALL USING (current_setting('role') = 'service_role');