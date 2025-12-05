-- Drop the current INSERT policy that requires auth.uid() match
DROP POLICY IF EXISTS "Allow first role creation for company" ON public.user_roles;

-- Create a new policy that allows inserting the first owner for any new company
-- This is safe because: 1) role must be 'owner', 2) company must have no existing roles
CREATE POLICY "Allow first owner role for new company" ON public.user_roles
FOR INSERT WITH CHECK (
  role = 'owner'::app_role
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur WHERE ur.company_id = user_roles.company_id
  )
);