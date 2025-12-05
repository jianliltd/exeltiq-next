-- Create junction table for package-client assignments
CREATE TABLE public.client_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, package_id)
);

-- Enable RLS
ALTER TABLE public.client_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_packages
CREATE POLICY "Users can view client packages in their company"
ON public.client_packages
FOR SELECT
USING (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can insert client packages in their company"
ON public.client_packages
FOR INSERT
WITH CHECK (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can delete client packages in their company"
ON public.client_packages
FOR DELETE
USING (company_id = get_user_company_id(auth.uid()));

-- Public can view their assigned packages (for booking page)
CREATE POLICY "Public can view client package assignments"
ON public.client_packages
FOR SELECT
USING (true);

-- Create index for better query performance
CREATE INDEX idx_client_packages_client ON public.client_packages(client_id);
CREATE INDEX idx_client_packages_package ON public.client_packages(package_id);
CREATE INDEX idx_client_packages_company ON public.client_packages(company_id);