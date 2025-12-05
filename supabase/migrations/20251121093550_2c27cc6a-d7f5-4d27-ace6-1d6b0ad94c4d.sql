-- Create revenue table for tracking payments
CREATE TABLE public.revenue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  package_type TEXT NOT NULL,
  payment_type TEXT NOT NULL DEFAULT 'online',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- Users can view revenue in their company
CREATE POLICY "Users can view revenue in their company"
  ON public.revenue
  FOR SELECT
  USING (company_id = get_user_company_id(auth.uid()));

-- Users can insert revenue in their company
CREATE POLICY "Users can insert revenue in their company"
  ON public.revenue
  FOR INSERT
  WITH CHECK (company_id = get_user_company_id(auth.uid()));

-- Create index for better query performance
CREATE INDEX idx_revenue_company_date ON public.revenue(company_id, created_at);
CREATE INDEX idx_revenue_client ON public.revenue(client_id);