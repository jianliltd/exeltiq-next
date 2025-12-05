-- Create security definer function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id uuid)
RETURNS uuid
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

-- Drop existing policy that causes recursion
DROP POLICY IF EXISTS "Users can view profiles in their company" ON public.profiles;

-- Create new policy using the security definer function
CREATE POLICY "Users can view profiles in their company" 
ON public.profiles 
FOR SELECT 
USING (
  company_id = public.get_user_company_id(auth.uid())
);