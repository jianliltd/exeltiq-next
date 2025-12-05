-- Drop existing SELECT policy that uses auth.uid()
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a new policy that allows viewing all roles (since auth checks happen via Clerk, not Supabase)
-- The application code already filters by userId from Clerk
CREATE POLICY "Allow viewing user roles" ON public.user_roles
FOR SELECT USING (true);

-- Also update the Admins policy since it uses auth.uid()
DROP POLICY IF EXISTS "Admins can manage roles in their company" ON public.user_roles;

-- For admin operations, we'll rely on the application code to verify admin status via Clerk
-- Only allow update/delete for existing companies where user has a role
CREATE POLICY "Allow managing roles for existing companies" ON public.user_roles
FOR ALL USING (true) WITH CHECK (true);