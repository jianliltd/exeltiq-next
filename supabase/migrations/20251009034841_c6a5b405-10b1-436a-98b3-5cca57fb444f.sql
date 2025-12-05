-- Allow anyone to view invites by token (needed for invite acceptance flow)
CREATE POLICY "Anyone can view invites by token"
ON public.team_invites
FOR SELECT
TO public
USING (true);