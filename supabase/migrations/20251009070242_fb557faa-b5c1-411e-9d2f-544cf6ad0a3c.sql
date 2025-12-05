-- Remove the overly permissive SELECT policy that allows anyone to view invites
DROP POLICY IF EXISTS "Anyone can view invites by token" ON public.team_invites;