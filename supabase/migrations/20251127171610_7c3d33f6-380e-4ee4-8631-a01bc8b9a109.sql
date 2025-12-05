-- Add RLS policy for admins to delete client notes
CREATE POLICY "Admins can delete notes in their company"
ON public.client_notes
FOR DELETE
USING (is_admin(auth.uid(), company_id));