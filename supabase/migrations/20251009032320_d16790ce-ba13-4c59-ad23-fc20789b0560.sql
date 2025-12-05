-- Create deal_notes table for tracking deal activity
CREATE TABLE public.deal_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deal_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for deal notes
CREATE POLICY "Users can view notes in their company" 
ON public.deal_notes 
FOR SELECT 
USING (company_id = get_user_company_id(auth.uid()));

CREATE POLICY "Users can insert notes in their company" 
ON public.deal_notes 
FOR INSERT 
WITH CHECK (company_id = get_user_company_id(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Users can update their own notes" 
ON public.deal_notes 
FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own notes" 
ON public.deal_notes 
FOR DELETE 
USING (created_by = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deal_notes_updated_at
BEFORE UPDATE ON public.deal_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();