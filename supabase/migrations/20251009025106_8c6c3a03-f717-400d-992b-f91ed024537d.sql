-- Add notes and additional fields to clients table
ALTER TABLE public.clients 
ADD COLUMN notes TEXT,
ADD COLUMN budget TEXT,
ADD COLUMN preferences TEXT,
ADD COLUMN allergies TEXT,
ADD COLUMN address TEXT,
ADD COLUMN city TEXT,
ADD COLUMN country TEXT,
ADD COLUMN company_name TEXT;

-- Create client_notes table for journal entries
CREATE TABLE public.client_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_notes
CREATE POLICY "Users can view notes in their company"
  ON public.client_notes FOR SELECT
  USING (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can insert notes in their company"
  ON public.client_notes FOR INSERT
  WITH CHECK (company_id = get_user_company_id(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Users can update their own notes"
  ON public.client_notes FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own notes"
  ON public.client_notes FOR DELETE
  USING (created_by = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_client_notes_updated_at
  BEFORE UPDATE ON public.client_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_client_notes_client_id ON public.client_notes(client_id);
CREATE INDEX idx_client_notes_company_id ON public.client_notes(company_id);