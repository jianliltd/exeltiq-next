-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS update_deals_updated_at ON public.deals;
DROP TRIGGER IF EXISTS update_client_notes_updated_at ON public.client_notes;
DROP TRIGGER IF EXISTS update_deal_notes_updated_at ON public.deal_notes;
DROP TRIGGER IF EXISTS update_team_invites_updated_at ON public.team_invites;
DROP TRIGGER IF EXISTS update_gym_schedule_templates_updated_at ON public.gym_schedule_templates;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, UUID, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_company_id(UUID) CASCADE;

DROP TABLE IF EXISTS public.gym_schedule_templates CASCADE;
DROP TABLE IF EXISTS public.team_invites CASCADE;
DROP TABLE IF EXISTS public.deal_notes CASCADE;
DROP TABLE IF EXISTS public.client_notes CASCADE;
DROP TABLE IF EXISTS public.deals CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff');

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  is_gym BOOLEAN DEFAULT false,
  gym_slug TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'free',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id),
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  budget TEXT,
  preferences TEXT,
  notes TEXT,
  allergies TEXT,
  status TEXT DEFAULT 'active',
  total_sessions INTEGER DEFAULT 0,
  sessions_used INTEGER DEFAULT 0,
  sessions_remaining INTEGER DEFAULT 0,
  session_package_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_gym_session BOOLEAN DEFAULT false,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  session_notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  stage TEXT DEFAULT 'lead',
  status TEXT DEFAULT 'open',
  service_category TEXT DEFAULT 'other',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create client_notes table
CREATE TABLE public.client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deal_notes table
CREATE TABLE public.deal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_invites table
CREATE TABLE public.team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  role public.app_role NOT NULL DEFAULT 'staff',
  status TEXT NOT NULL DEFAULT 'pending',
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gym_schedule_templates table
CREATE TABLE public.gym_schedule_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
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

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _company_id UUID, _role app_role)
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

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID, _company_id UUID)
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

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID, _company_id UUID)
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  company_uuid UUID;
  is_first_user BOOLEAN;
BEGIN
  company_uuid := (NEW.raw_user_meta_data->>'company_id')::UUID;
  
  is_first_user := NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE company_id = company_uuid
  );
  
  INSERT INTO public.profiles (id, company_id, first_name, last_name)
  VALUES (
    NEW.id,
    company_uuid,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  INSERT INTO public.user_roles (user_id, company_id, role)
  VALUES (
    NEW.id,
    company_uuid,
    CASE WHEN is_first_user THEN 'owner'::app_role ELSE 'staff'::app_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_notes_updated_at
  BEFORE UPDATE ON public.client_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deal_notes_updated_at
  BEFORE UPDATE ON public.deal_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_invites_updated_at
  BEFORE UPDATE ON public.team_invites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gym_schedule_templates_updated_at
  BEFORE UPDATE ON public.gym_schedule_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
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

-- Companies policies
CREATE POLICY "Users can create companies during signup" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their company" ON public.companies FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.company_id = companies.id));
CREATE POLICY "Anyone can check company slugs" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public can view gym companies by slug" ON public.companies FOR SELECT USING (is_gym = true AND gym_slug IS NOT NULL);
CREATE POLICY "Company owners can update their company" ON public.companies FOR UPDATE USING (has_role(auth.uid(), id, 'owner'));

-- Profiles policies
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can view profiles in their company" ON public.profiles FOR SELECT USING (company_id = get_user_company_id(auth.uid()));

-- User roles policies
CREATE POLICY "Users can view roles in their company" ON public.user_roles FOR SELECT USING (company_id IN (SELECT profiles.company_id FROM profiles WHERE profiles.id = auth.uid()));
CREATE POLICY "Admins can manage roles in their company" ON public.user_roles FOR ALL USING (is_admin(auth.uid(), company_id)) WITH CHECK (is_admin(auth.uid(), company_id));

-- Clients policies
CREATE POLICY "Users can view clients in their company" ON public.clients FOR SELECT USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can insert clients in their company" ON public.clients FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can update clients in their company" ON public.clients FOR UPDATE USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can delete clients in their company" ON public.clients FOR DELETE USING (company_id = get_user_company_id(auth.uid()));

-- Bookings policies
CREATE POLICY "Users can view bookings in their company" ON public.bookings FOR SELECT USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can insert bookings in their company" ON public.bookings FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can update bookings in their company" ON public.bookings FOR UPDATE USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can delete bookings in their company" ON public.bookings FOR DELETE USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Clients can view their own gym bookings" ON public.bookings FOR SELECT USING (is_gym_session = true AND client_id IN (SELECT id FROM clients WHERE email = (auth.jwt() ->> 'email')));
CREATE POLICY "Clients can book gym sessions" ON public.bookings FOR INSERT WITH CHECK (is_gym_session = true AND client_id IN (SELECT id FROM clients WHERE email = (auth.jwt() ->> 'email')) AND start_time > now());
CREATE POLICY "Clients can cancel gym bookings" ON public.bookings FOR DELETE USING (is_gym_session = true AND client_id IN (SELECT id FROM clients WHERE email = (auth.jwt() ->> 'email')) AND start_time > (now() + interval '2 hours'));

-- Deals policies
CREATE POLICY "Users can view deals in their company" ON public.deals FOR SELECT USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can insert deals in their company" ON public.deals FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can update deals in their company" ON public.deals FOR UPDATE USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can delete deals in their company" ON public.deals FOR DELETE USING (company_id = get_user_company_id(auth.uid()));

-- Client notes policies
CREATE POLICY "Users can view notes in their company" ON public.client_notes FOR SELECT USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can insert notes in their company" ON public.client_notes FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "Users can update their own notes" ON public.client_notes FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete their own notes" ON public.client_notes FOR DELETE USING (created_by = auth.uid());

-- Deal notes policies
CREATE POLICY "Users can view notes in their company" ON public.deal_notes FOR SELECT USING (company_id = get_user_company_id(auth.uid()));
CREATE POLICY "Users can insert notes in their company" ON public.deal_notes FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "Users can update their own notes" ON public.deal_notes FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete their own notes" ON public.deal_notes FOR DELETE USING (created_by = auth.uid());

-- Team invites policies
CREATE POLICY "Admins can view invites in their company" ON public.team_invites FOR SELECT USING (is_admin(auth.uid(), company_id));
CREATE POLICY "Admins can create invites in their company" ON public.team_invites FOR INSERT WITH CHECK (is_admin(auth.uid(), company_id) AND invited_by = auth.uid());
CREATE POLICY "Admins can update invites in their company" ON public.team_invites FOR UPDATE USING (is_admin(auth.uid(), company_id));
CREATE POLICY "Admins can delete invites in their company" ON public.team_invites FOR DELETE USING (is_admin(auth.uid(), company_id));

-- Gym schedule templates policies
CREATE POLICY "Public can view active gym schedules" ON public.gym_schedule_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Gym owners can manage schedule templates" ON public.gym_schedule_templates FOR ALL USING (is_admin(auth.uid(), company_id)) WITH CHECK (is_admin(auth.uid(), company_id));