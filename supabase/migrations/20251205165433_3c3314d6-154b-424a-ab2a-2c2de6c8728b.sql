-- STAGE 1: Drop ALL policies that might depend on UUID functions

-- Companies
DROP POLICY IF EXISTS "Company owners can update their company" ON public.companies;
DROP POLICY IF EXISTS "Users can view their company" ON public.companies;

-- User roles
DROP POLICY IF EXISTS "Allow first role creation for company" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view roles in their company" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles in their company" ON public.user_roles;

-- Team invites
DROP POLICY IF EXISTS "Admins can view invites in their company" ON public.team_invites;
DROP POLICY IF EXISTS "Admins can create invites in their company" ON public.team_invites;
DROP POLICY IF EXISTS "Admins can update invites in their company" ON public.team_invites;
DROP POLICY IF EXISTS "Admins can delete invites in their company" ON public.team_invites;

-- Gym schedule templates
DROP POLICY IF EXISTS "Gym owners can manage schedule templates" ON public.gym_schedule_templates;

-- Client notes
DROP POLICY IF EXISTS "Admins can delete notes in their company" ON public.client_notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.client_notes;
DROP POLICY IF EXISTS "Users can insert notes in their company" ON public.client_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.client_notes;
DROP POLICY IF EXISTS "Users can view notes in their company" ON public.client_notes;

-- Deal notes
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.deal_notes;
DROP POLICY IF EXISTS "Users can insert notes in their company" ON public.deal_notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.deal_notes;
DROP POLICY IF EXISTS "Users can view notes in their company" ON public.deal_notes;

-- Bookings
DROP POLICY IF EXISTS "Users can delete bookings in their company" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings in their company" ON public.bookings;
DROP POLICY IF EXISTS "Users can update bookings in their company" ON public.bookings;
DROP POLICY IF EXISTS "Users can view bookings in their company" ON public.bookings;

-- Clients
DROP POLICY IF EXISTS "Users can delete clients in their company" ON public.clients;
DROP POLICY IF EXISTS "Users can insert clients in their company" ON public.clients;
DROP POLICY IF EXISTS "Users can update clients in their company" ON public.clients;
DROP POLICY IF EXISTS "Users can view clients in their company" ON public.clients;

-- Client packages
DROP POLICY IF EXISTS "Users can delete client packages in their company" ON public.client_packages;
DROP POLICY IF EXISTS "Users can insert client packages in their company" ON public.client_packages;
DROP POLICY IF EXISTS "Users can view client packages in their company" ON public.client_packages;

-- Deals
DROP POLICY IF EXISTS "Users can delete deals in their company" ON public.deals;
DROP POLICY IF EXISTS "Users can insert deals in their company" ON public.deals;
DROP POLICY IF EXISTS "Users can update deals in their company" ON public.deals;
DROP POLICY IF EXISTS "Users can view deals in their company" ON public.deals;

-- Email templates
DROP POLICY IF EXISTS "Users can delete templates in their company" ON public.email_templates;
DROP POLICY IF EXISTS "Users can insert templates in their company" ON public.email_templates;
DROP POLICY IF EXISTS "Users can update templates in their company" ON public.email_templates;
DROP POLICY IF EXISTS "Users can view templates in their company" ON public.email_templates;

-- Packages
DROP POLICY IF EXISTS "Users can delete packages in their company" ON public.packages;
DROP POLICY IF EXISTS "Users can insert packages in their company" ON public.packages;
DROP POLICY IF EXISTS "Users can update packages in their company" ON public.packages;
DROP POLICY IF EXISTS "Users can view packages in their company" ON public.packages;

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their company" ON public.profiles;

-- Revenue
DROP POLICY IF EXISTS "Users can delete revenue in their company" ON public.revenue;
DROP POLICY IF EXISTS "Users can insert revenue in their company" ON public.revenue;
DROP POLICY IF EXISTS "Users can view revenue in their company" ON public.revenue;

-- Gym waiting list
DROP POLICY IF EXISTS "Users can view waiting list in their company" ON public.gym_waiting_list;