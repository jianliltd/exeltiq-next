-- Add created_by to deals table to track who created the deal
ALTER TABLE public.deals
ADD COLUMN created_by UUID REFERENCES public.profiles(id);

-- Backfill existing deals with a default value (could be company owner or leave null)
-- For now we'll leave them null since we don't know who created them

-- Add an index for better performance
CREATE INDEX idx_deals_created_by ON public.deals(created_by);