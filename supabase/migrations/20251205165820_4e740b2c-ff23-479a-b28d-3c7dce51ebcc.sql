-- STAGE 2: Drop UUID versions of functions
DROP FUNCTION IF EXISTS public.get_user_company_id(uuid);
DROP FUNCTION IF EXISTS public.has_role(uuid, uuid, app_role);
DROP FUNCTION IF EXISTS public.is_admin(uuid, uuid);
DROP FUNCTION IF EXISTS public.get_user_role(uuid, uuid);

-- Create TEXT version of get_user_company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- STAGE 3: Recreate all policies using TEXT functions

-- Companies
CREATE POLICY "Company owners can update their company" ON public.companies
FOR UPDATE USING (has_role(auth.uid()::text, id, 'owner'::app_role));

CREATE POLICY "Users can view their company" ON public.companies
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_roles.company_id = companies.id 
  AND user_roles.user_id = auth.uid()::text
));

-- User roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Allow first role creation for company" ON public.user_roles
FOR INSERT WITH CHECK (
  user_id = auth.uid()::text 
  AND role = 'owner'::app_role
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.company_id = user_roles.company_id
  )
);

CREATE POLICY "Admins can manage roles in their company" ON public.user_roles
FOR ALL USING (is_admin(auth.uid()::text, company_id))
WITH CHECK (is_admin(auth.uid()::text, company_id));

-- Team invites
CREATE POLICY "Admins can view invites in their company" ON public.team_invites
FOR SELECT USING (is_admin(auth.uid()::text, company_id));

CREATE POLICY "Admins can create invites in their company" ON public.team_invites
FOR INSERT WITH CHECK (is_admin(auth.uid()::text, company_id) AND invited_by = auth.uid());

CREATE POLICY "Admins can update invites in their company" ON public.team_invites
FOR UPDATE USING (is_admin(auth.uid()::text, company_id));

CREATE POLICY "Admins can delete invites in their company" ON public.team_invites
FOR DELETE USING (is_admin(auth.uid()::text, company_id));

-- Gym schedule templates
CREATE POLICY "Gym owners can manage schedule templates" ON public.gym_schedule_templates
FOR ALL USING (is_admin(auth.uid()::text, company_id))
WITH CHECK (is_admin(auth.uid()::text, company_id));

-- Client notes
CREATE POLICY "Users can view notes in their company" ON public.client_notes
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert notes in their company" ON public.client_notes
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text) AND created_by = auth.uid());

CREATE POLICY "Users can update their own notes" ON public.client_notes
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own notes" ON public.client_notes
FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "Admins can delete notes in their company" ON public.client_notes
FOR DELETE USING (is_admin(auth.uid()::text, company_id));

-- Deal notes
CREATE POLICY "Users can view notes in their company" ON public.deal_notes
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert notes in their company" ON public.deal_notes
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text) AND created_by = auth.uid());

CREATE POLICY "Users can update their own notes" ON public.deal_notes
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own notes" ON public.deal_notes
FOR DELETE USING (created_by = auth.uid());

-- Bookings
CREATE POLICY "Users can view bookings in their company" ON public.bookings
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert bookings in their company" ON public.bookings
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can update bookings in their company" ON public.bookings
FOR UPDATE USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can delete bookings in their company" ON public.bookings
FOR DELETE USING (company_id = get_user_company_id(auth.uid()::text));

-- Clients
CREATE POLICY "Users can view clients in their company" ON public.clients
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert clients in their company" ON public.clients
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can update clients in their company" ON public.clients
FOR UPDATE USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can delete clients in their company" ON public.clients
FOR DELETE USING (company_id = get_user_company_id(auth.uid()::text));

-- Client packages
CREATE POLICY "Users can view client packages in their company" ON public.client_packages
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert client packages in their company" ON public.client_packages
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can delete client packages in their company" ON public.client_packages
FOR DELETE USING (company_id = get_user_company_id(auth.uid()::text));

-- Deals
CREATE POLICY "Users can view deals in their company" ON public.deals
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert deals in their company" ON public.deals
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can update deals in their company" ON public.deals
FOR UPDATE USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can delete deals in their company" ON public.deals
FOR DELETE USING (company_id = get_user_company_id(auth.uid()::text));

-- Email templates
CREATE POLICY "Users can view templates in their company" ON public.email_templates
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert templates in their company" ON public.email_templates
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can update templates in their company" ON public.email_templates
FOR UPDATE USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can delete templates in their company" ON public.email_templates
FOR DELETE USING (company_id = get_user_company_id(auth.uid()::text));

-- Packages
CREATE POLICY "Users can view packages in their company" ON public.packages
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert packages in their company" ON public.packages
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can update packages in their company" ON public.packages
FOR UPDATE USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can delete packages in their company" ON public.packages
FOR DELETE USING (company_id = get_user_company_id(auth.uid()::text));

-- Profiles (uses clerk_id for Clerk auth)
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (clerk_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (clerk_id = auth.uid()::text);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (clerk_id = auth.uid()::text);

CREATE POLICY "Users can view profiles in their company" ON public.profiles
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

-- Revenue
CREATE POLICY "Users can view revenue in their company" ON public.revenue
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));

CREATE POLICY "Users can insert revenue in their company" ON public.revenue
FOR INSERT WITH CHECK (company_id = get_user_company_id(auth.uid()::text));

-- Gym waiting list
CREATE POLICY "Users can view waiting list in their company" ON public.gym_waiting_list
FOR SELECT USING (company_id = get_user_company_id(auth.uid()::text));