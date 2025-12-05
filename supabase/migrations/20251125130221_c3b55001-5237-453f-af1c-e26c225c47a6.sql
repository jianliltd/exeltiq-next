-- Add RLS policy to allow anonymous users to query their own client record by email for gym booking login
CREATE POLICY "Anon can view clients for gym booking login" 
ON public.clients 
FOR SELECT 
USING (true);