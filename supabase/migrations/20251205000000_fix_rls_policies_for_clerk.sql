-- Migration: Enable RLS with permissive policies for Clerk authentication
-- This allows access while keeping RLS enabled

-- ============================================================================
-- 1. Drop ALL existing RLS policies on all tables
-- ============================================================================
DO $$
DECLARE
    r RECORD;
    tables_to_fix TEXT[] := ARRAY[
        'profiles', 'companies', 'user_roles', 'clients', 'bookings', 
        'deals', 'client_notes', 'deal_notes', 'team_invites', 
        'gym_schedule_templates', 'gym_waiting_list', 'packages', 
        'revenue', 'client_packages', 'email_templates'
    ];
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY tables_to_fix
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl) THEN
            FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl
            LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, tbl);
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- ============================================================================
-- 2. Enable RLS on all tables
-- ============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_schedule_templates ENABLE ROW LEVEL SECURITY;

-- Enable RLS on optional tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gym_waiting_list') THEN
        EXECUTE 'ALTER TABLE public.gym_waiting_list ENABLE ROW LEVEL SECURITY';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages') THEN
        EXECUTE 'ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'revenue') THEN
        EXECUTE 'ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_packages') THEN
        EXECUTE 'ALTER TABLE public.client_packages ENABLE ROW LEVEL SECURITY';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_templates') THEN
        EXECUTE 'ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY';
    END IF;
END $$;

-- ============================================================================
-- 3. Create permissive RLS policies (allow all access)
-- ============================================================================

-- Companies
CREATE POLICY "Allow all access to companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);

-- Profiles
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- User roles
CREATE POLICY "Allow all access to user_roles" ON public.user_roles FOR ALL USING (true) WITH CHECK (true);

-- Clients
CREATE POLICY "Allow all access to clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- Bookings
CREATE POLICY "Allow all access to bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- Deals
CREATE POLICY "Allow all access to deals" ON public.deals FOR ALL USING (true) WITH CHECK (true);

-- Client notes
CREATE POLICY "Allow all access to client_notes" ON public.client_notes FOR ALL USING (true) WITH CHECK (true);

-- Deal notes
CREATE POLICY "Allow all access to deal_notes" ON public.deal_notes FOR ALL USING (true) WITH CHECK (true);

-- Team invites
CREATE POLICY "Allow all access to team_invites" ON public.team_invites FOR ALL USING (true) WITH CHECK (true);

-- Gym schedule templates
CREATE POLICY "Allow all access to gym_schedule_templates" ON public.gym_schedule_templates FOR ALL USING (true) WITH CHECK (true);

-- Optional tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gym_waiting_list') THEN
        EXECUTE 'CREATE POLICY "Allow all access to gym_waiting_list" ON public.gym_waiting_list FOR ALL USING (true) WITH CHECK (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'packages') THEN
        EXECUTE 'CREATE POLICY "Allow all access to packages" ON public.packages FOR ALL USING (true) WITH CHECK (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'revenue') THEN
        EXECUTE 'CREATE POLICY "Allow all access to revenue" ON public.revenue FOR ALL USING (true) WITH CHECK (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_packages') THEN
        EXECUTE 'CREATE POLICY "Allow all access to client_packages" ON public.client_packages FOR ALL USING (true) WITH CHECK (true)';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_templates') THEN
        EXECUTE 'CREATE POLICY "Allow all access to email_templates" ON public.email_templates FOR ALL USING (true) WITH CHECK (true)';
    END IF;
END $$;

