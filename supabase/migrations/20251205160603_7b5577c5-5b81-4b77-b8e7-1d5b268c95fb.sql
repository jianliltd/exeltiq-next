-- Drop ALL foreign key constraints FIRST before altering columns
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

ALTER TABLE public.gym_schedule_templates
DROP CONSTRAINT IF EXISTS gym_schedule_templates_created_by_fkey;

-- Now change user_roles.user_id from UUID to TEXT
ALTER TABLE public.user_roles 
ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Update gym_schedule_templates.created_by to TEXT
ALTER TABLE public.gym_schedule_templates
ALTER COLUMN created_by TYPE TEXT USING created_by::TEXT;

-- Update profiles table to support Clerk users
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);

-- Update has_role function to work with TEXT user_id
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _company_id uuid, _role app_role)
RETURNS boolean
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
  )
$$;

-- Update is_admin function signature
CREATE OR REPLACE FUNCTION public.is_admin(_user_id TEXT, _company_id uuid)
RETURNS boolean
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
  )
$$;

-- Update get_user_role function signature
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id TEXT, _company_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = _user_id AND company_id = _company_id
  LIMIT 1
$$;