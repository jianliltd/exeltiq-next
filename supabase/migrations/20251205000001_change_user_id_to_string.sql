-- Migration: Change user_id columns from UUID to TEXT for Clerk authentication
-- Clerk uses string-based user IDs (e.g., 'user_2abc123...'), not UUIDs

-- ============================================================================
-- 1. Drop triggers that reference auth.users
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================================
-- 2. Drop existing functions that use UUID for user_id (CASCADE will drop dependent policies)
-- ============================================================================
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, UUID, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_company_id(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.delete_bookings_by_schedule_creator(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.delete_waitlist_by_schedule_creator(UUID, UUID) CASCADE;

-- ============================================================================
-- 3. Drop ALL RLS policies on affected tables using dynamic SQL
-- This ensures we catch all policies regardless of how they were named
-- ============================================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on profiles table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
    END LOOP;
    
    -- Drop all policies on companies table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'companies'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.companies', r.policyname);
    END LOOP;
    
    -- Drop all policies on user_roles table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', r.policyname);
    END LOOP;
    
    -- Drop all policies on clients table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', r.policyname);
    END LOOP;
    
    -- Drop all policies on bookings table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', r.policyname);
    END LOOP;
    
    -- Drop all policies on deals table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'deals'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.deals', r.policyname);
    END LOOP;
    
    -- Drop all policies on client_notes table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'client_notes'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.client_notes', r.policyname);
    END LOOP;
    
    -- Drop all policies on deal_notes table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'deal_notes'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.deal_notes', r.policyname);
    END LOOP;
    
    -- Drop all policies on team_invites table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'team_invites'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.team_invites', r.policyname);
    END LOOP;
    
    -- Drop all policies on gym_schedule_templates table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'gym_schedule_templates'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.gym_schedule_templates', r.policyname);
    END LOOP;
    
    -- Drop all policies on gym_waiting_list table
    FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'gym_waiting_list'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.gym_waiting_list', r.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- 4. Drop foreign key constraints referencing auth.users
-- ============================================================================

-- profiles.id
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey CASCADE;

-- user_roles.user_id
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey CASCADE;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_company_id_key CASCADE;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_key CASCADE;

-- deals.created_by
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_created_by_fkey CASCADE;

-- client_notes.created_by
ALTER TABLE public.client_notes DROP CONSTRAINT IF EXISTS client_notes_created_by_fkey CASCADE;

-- deal_notes.created_by
ALTER TABLE public.deal_notes DROP CONSTRAINT IF EXISTS deal_notes_created_by_fkey CASCADE;

-- team_invites.invited_by
ALTER TABLE public.team_invites DROP CONSTRAINT IF EXISTS team_invites_invited_by_fkey CASCADE;

-- gym_schedule_templates.created_by
ALTER TABLE public.gym_schedule_templates DROP CONSTRAINT IF EXISTS gym_schedule_templates_created_by_fkey CASCADE;

-- ============================================================================
-- 5. Alter columns from UUID to TEXT
-- ============================================================================

-- profiles.id (primary key - need to recreate)
ALTER TABLE public.profiles ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- user_roles.user_id (unique per user - one user can only belong to one company)
ALTER TABLE public.user_roles ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_key UNIQUE(user_id);

-- deals.created_by
ALTER TABLE public.deals ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- client_notes.created_by
ALTER TABLE public.client_notes ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- deal_notes.created_by
ALTER TABLE public.deal_notes ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- team_invites.invited_by
ALTER TABLE public.team_invites ALTER COLUMN invited_by TYPE TEXT USING invited_by::TEXT;

-- gym_schedule_templates.created_by
ALTER TABLE public.gym_schedule_templates ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- ============================================================================
-- 6. Recreate functions with TEXT type for user_id
-- ============================================================================

-- Function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id 
  FROM public.profiles 
  WHERE id = _user_id
  LIMIT 1;
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _company_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND company_id = _company_id
      AND role = _role
  );
$$;

-- Function to check if user is owner or admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id TEXT, _company_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND company_id = _company_id
      AND role IN ('owner', 'admin')
  );
$$;

-- Function to get user's role in a company
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id TEXT, _company_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id AND company_id = _company_id
  LIMIT 1;
$$;

-- Function to delete bookings by schedule creator
CREATE OR REPLACE FUNCTION public.delete_bookings_by_schedule_creator(
  p_company_id UUID,
  p_created_by TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.bookings
  WHERE schedule_id IN (
    SELECT id FROM public.gym_schedule_templates
    WHERE company_id = p_company_id
    AND created_by = p_created_by
  );
END;
$$;

-- Function to delete waitlist by schedule creator
CREATE OR REPLACE FUNCTION public.delete_waitlist_by_schedule_creator(
  p_company_id UUID,
  p_created_by TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.gym_waiting_list
  WHERE schedule_id IN (
    SELECT id FROM public.gym_schedule_templates
    WHERE company_id = p_company_id
    AND created_by = p_created_by
  );
END;
$$;

-- ============================================================================
-- 7. Create new permissive RLS policies for Clerk auth
-- (Since Clerk JWT is passed via Supabase client, we use service_role for backend)
-- ============================================================================

-- Companies policies
CREATE POLICY "Service role full access to companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Service role full access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- User roles policies
CREATE POLICY "Service role full access to user_roles" ON public.user_roles FOR ALL USING (true) WITH CHECK (true);

-- Clients policies
CREATE POLICY "Service role full access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Bookings policies  
CREATE POLICY "Service role full access to bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Deals policies
CREATE POLICY "Service role full access to deals" ON public.deals FOR ALL USING (true) WITH CHECK (true);

-- Client notes policies
CREATE POLICY "Service role full access to client_notes" ON public.client_notes FOR ALL USING (true) WITH CHECK (true);

-- Deal notes policies
CREATE POLICY "Service role full access to deal_notes" ON public.deal_notes FOR ALL USING (true) WITH CHECK (true);

-- Team invites policies
CREATE POLICY "Service role full access to team_invites" ON public.team_invites FOR ALL USING (true) WITH CHECK (true);

-- Gym schedule templates policies
CREATE POLICY "Service role full access to gym_schedule_templates" ON public.gym_schedule_templates FOR ALL USING (true) WITH CHECK (true);

-- Gym waiting list policies
CREATE POLICY "Service role full access to gym_waiting_list" ON public.gym_waiting_list FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- 8. Add indexes for TEXT user_id columns for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_by ON public.deals(created_by);
CREATE INDEX IF NOT EXISTS idx_client_notes_created_by ON public.client_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_deal_notes_created_by ON public.deal_notes(created_by);
CREATE INDEX IF NOT EXISTS idx_team_invites_invited_by ON public.team_invites(invited_by);
CREATE INDEX IF NOT EXISTS idx_gym_schedule_templates_created_by ON public.gym_schedule_templates(created_by);

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON COLUMN public.profiles.id IS 'Clerk user ID (string format, e.g., user_2abc123...)';
COMMENT ON COLUMN public.user_roles.user_id IS 'Clerk user ID (string format)';
COMMENT ON COLUMN public.deals.created_by IS 'Clerk user ID who created the deal';
COMMENT ON COLUMN public.client_notes.created_by IS 'Clerk user ID who created the note';
COMMENT ON COLUMN public.deal_notes.created_by IS 'Clerk user ID who created the note';
COMMENT ON COLUMN public.team_invites.invited_by IS 'Clerk user ID who sent the invite';
COMMENT ON COLUMN public.gym_schedule_templates.created_by IS 'Clerk user ID who created the template';
