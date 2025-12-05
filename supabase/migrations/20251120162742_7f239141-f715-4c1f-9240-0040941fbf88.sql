-- Create packages table for subscription packages
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_count INTEGER NOT NULL DEFAULT 0,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policies for packages
CREATE POLICY "Users can view packages in their company" 
ON public.packages 
FOR SELECT 
USING (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can insert packages in their company" 
ON public.packages 
FOR INSERT 
WITH CHECK (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can update packages in their company" 
ON public.packages 
FOR UPDATE 
USING (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can delete packages in their company" 
ON public.packages 
FOR DELETE 
USING (company_id = get_user_company_id(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();