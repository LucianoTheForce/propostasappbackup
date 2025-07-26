-- Create a dummy user entry to satisfy foreign key constraints
-- This is a temporary solution while we don't have proper authentication

-- First, insert into auth.users (this might fail if we don't have access)
-- INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at)
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@theforce.cc', NOW(), NOW(), NOW());

-- Then insert into public.users
-- INSERT INTO public.users (id, email, name, role, created_at)
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin@theforce.cc', 'Admin Force', 'admin', NOW())
-- ON CONFLICT (id) DO NOTHING;

-- Or temporarily make created_by nullable
ALTER TABLE proposals ALTER COLUMN created_by DROP NOT NULL;