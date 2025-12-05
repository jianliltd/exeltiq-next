-- Add company contact fields to companies table
ALTER TABLE public.companies
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN website TEXT;

-- Create team_invites table for managing invitations
CREATE TABLE public.team_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'staff'::app_role,
  invited_by UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for team invites
CREATE POLICY "Admins can view invites in their company" 
ON public.team_invites 
FOR SELECT 
USING (is_admin(auth.uid(), company_id));

CREATE POLICY "Admins can create invites in their company" 
ON public.team_invites 
FOR INSERT 
WITH CHECK (is_admin(auth.uid(), company_id) AND invited_by = auth.uid());

CREATE POLICY "Admins can update invites in their company" 
ON public.team_invites 
FOR UPDATE 
USING (is_admin(auth.uid(), company_id));

CREATE POLICY "Admins can delete invites in their company" 
ON public.team_invites 
FOR DELETE 
USING (is_admin(auth.uid(), company_id));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_invites_updated_at
BEFORE UPDATE ON public.team_invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_team_invites_company_id ON public.team_invites(company_id);
CREATE INDEX idx_team_invites_token ON public.team_invites(token);
CREATE INDEX idx_team_invites_email ON public.team_invites(email);